import { z } from 'zod';

import { shortUrlCode } from './common';

export const CreateQrDtSchema = z.object({
  code: shortUrlCode(),
});

export type CreateQrDto = z.infer<typeof CreateQrDtSchema>;
