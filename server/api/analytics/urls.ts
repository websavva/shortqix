import { eq, sql, desc } from 'drizzle-orm';

import { PaginationParamsSchema } from '#shared/dtos';
import {
  assertAuth,
  getValidatedQuery,
  defineSafeEventHandler,
  createPaginationMetadata,
} from '#server/utils';
import {
  db,
  shortenedUrls,
  type ShortenedUrl,
} from '#server/db';

export default defineSafeEventHandler(
  async (event) => {
    const { page, limit } = await getValidatedQuery(
      PaginationParamsSchema,
      event,
    );

    assertAuth(event);

    // Parse pagination parameters
    const offset = (page - 1) * limit;

    // Get paginated URLs with click data
    const urls = (await db
      .select({
        id: shortenedUrls.id,
        code: shortenedUrls.code,
        isCustom: shortenedUrls.isCustom,
        longUrl: shortenedUrls.longUrl,
        ...(event.context.user!.isPremium && {
          clicks: shortenedUrls.clicks,
        }),
        createdAt: shortenedUrls.createdAt,
      })
      .from(shortenedUrls)
      .where(
        eq(shortenedUrls.userId, event.context.user!.id),
      )
      .orderBy(desc(shortenedUrls.createdAt))
      .offset(offset)
      .limit(limit)) as Array<
      Pick<
        ShortenedUrl,
        'id' | 'code' | 'isCustom' | 'longUrl' | 'createdAt'
      > & {
        clicks?: number;
      }
    >;

    // Get total count for pagination metadata
    const [{ totalCount = 0 } = {}] = await db
      .select({
        totalCount: sql<number>`count(${shortenedUrls.id})::integer`,
      })
      .from(shortenedUrls)
      .where(
        eq(shortenedUrls.userId, event.context.user!.id),
      );

    const pagination = createPaginationMetadata({
      totalCount,
      page,
      limit,
    });

    return {
      urls,
      pagination,
    };
  },
  {
    errorText: 'Failed to fetch URLs',
  },
);
