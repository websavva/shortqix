import { z } from 'zod';

export const CreateMagicLinkDtoSchema = z.object({
  email: z.email('Invalid email'),
});

export type CreateMagicLinkDto = z.infer<
  typeof CreateMagicLinkDtoSchema
>;
