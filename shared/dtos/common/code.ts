import { z } from 'zod';

export const shortUrlCode = () =>
  z
    .string()
    // .min(1, 'Code is required')
    .max(32, 'Code is too long')
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      'Code can only contain letters and numbers',
    );
