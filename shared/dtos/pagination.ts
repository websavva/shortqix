import { z } from 'zod';

export const PaginationParamsSchema = () =>
  z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
  });

export type PaginationParams = z.infer<
  typeof PaginationParamsSchema
>;
