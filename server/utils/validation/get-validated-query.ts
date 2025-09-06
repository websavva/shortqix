import {
  type H3Event,
  getValidatedQuery as _getValidatedQuery,
} from 'h3';
import type { z } from 'zod';

import { validateBySchema } from './validate-by-schema';

export async function getValidatedQuery<
  S extends z.ZodSchema,
>(schema: S, request: H3Event) {
  return _getValidatedQuery(request, (data) =>
    validateBySchema(schema, data),
  );
}
