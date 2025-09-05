import {
  readValidatedBody as _readValidatedBody,
  type H3Event,
} from 'h3';
import { z } from 'zod';

import { validateBySchema } from './validate-by-schema';

export async function readValidatedBody<
  S extends z.ZodSchema,
>(schema: S, request: H3Event) {
  const body = await _readValidatedBody(request, (data) =>
    validateBySchema(schema, data),
  );

  return body;
}
