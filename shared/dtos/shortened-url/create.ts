import { z } from 'zod';

import { shortUrlCode } from '../common';

export const CreateShortenedUrlDtSchema = z.object({
  url: z.url({
    error: 'Invalid URL',
    protocol: /^https?$/,
  }),
  code: z.optional(shortUrlCode()).nullable(),
});

export type CreateShortenedUrlDto = z.infer<
  typeof CreateShortenedUrlDtSchema
>;
