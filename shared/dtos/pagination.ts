import { z } from 'zod';

export const PaginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(5),
});

export type PaginationParams = z.infer<
  typeof PaginationParamsSchema
>;

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalCount: number;
  count: number;
  hasNext: boolean;
  hasPrev: boolean;
}
