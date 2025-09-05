import { z } from 'zod';

export const VerifyMagicLinkDtSchema = z.object({
  token: z
    .string()
    .min(1, 'Token is required')
    .max(100, 'Token is too long'),
});

export type VerifyMagicLinkDto = z.infer<
  typeof VerifyMagicLinkDtSchema
>;
