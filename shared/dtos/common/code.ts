import { z } from 'zod';

export const shortUrlCode = () =>
  z
    .string()
    .max(32, 'Code is too long')
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      'Code can only contain letters and numbers',
    )
    .refine((code) => !/^(-|_)+$/.test(code), {
      message:
        'Code cannot contain only hyphens or underscores',
    });
