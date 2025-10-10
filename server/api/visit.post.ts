import { readBody, getRequestIP } from 'h3';

import { defineSafeEventHandler } from '#server/utils';
import { db, pageVisits } from '#server/db';

export default defineSafeEventHandler(async (event) => {
  const { url } = await readBody(event);

  const { user, sessionId } = event.context;

  const ipAddress = getRequestIP(event, {
    xForwardedFor: true,
  });

  await db.insert(pageVisits).values({
    url,
    userId: user?.id,
    ipAddress,
    sessionId,
  });
});
