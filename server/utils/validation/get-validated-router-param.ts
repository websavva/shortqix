import { getRouterParam, type H3Event } from 'h3';
import type { z } from 'zod';

import { validateBySchema } from './validate-by-schema';

export async function getValidatedRouterParam<
  S extends z.ZodSchema,
>(schema: S, request: H3Event, name: string) {
  const rawParamValue = getRouterParam(request, name);

  return validateBySchema(schema, rawParamValue);
}
