import { z } from 'zod';

export const CreateMagicLinkDtSchema = z.object({
  email: z.email('Invalid email'),
});

export type CreateMagicLinkDto = z.infer<
  typeof CreateMagicLinkDtSchema
>;
