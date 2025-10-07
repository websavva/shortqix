import { z } from 'zod';

export const ErrorLogDtoSchema = z.object({
  type: z.enum(['vue', 'global', 'promise']),
  message: z.string().min(1),
  stack: z.string().nullable().default(null),
  url: z.string().nullable().default(null),
  env: z.enum(['server', 'client']),
});

export type ErrorLogDto = z.infer<typeof ErrorLogDtoSchema>;
