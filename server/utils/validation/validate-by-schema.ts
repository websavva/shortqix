import { createError } from 'h3';
import { flattenError, z } from 'zod';

export function normalizeZodError(error: z.ZodError) {
  const flattenedError = flattenError(error);

  const [validationMessage = 'Validation failed'] =
    Object.values(flattenedError.fieldErrors)
      .flat()
      .concat(flattenedError.formErrors)
      .filter(
        (validationMessage) =>
          typeof validationMessage === 'string',
      );

  return createError({
    statusCode: 400,
    statusMessage: validationMessage,
  });
}

export async function validateBySchema<
  S extends z.ZodSchema,
>(schema: S, data: unknown): Promise<z.infer<S>> {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    throw normalizeZodError(result.error);
  }

  return result.data;
}
