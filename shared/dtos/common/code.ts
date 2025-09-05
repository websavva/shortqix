import { z } from 'zod';

export const shortUrlCode = () =>
  z
    .string()
    .min(1, 'Code is required')
    .max(32, 'Code is too long');
