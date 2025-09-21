import type { PaginationMetadata } from '#shared/dtos/pagination';

export function createPaginationMetadata({
  totalCount,
  page,
  limit,
}: {
  totalCount: number;
  page: number;
  limit: number;
}): PaginationMetadata {
  const count = Math.ceil(totalCount / limit);

  return {
    page,
    limit,
    totalCount,
    count,
    hasNext: page < count,
    hasPrev: page > 1,
  };
}
