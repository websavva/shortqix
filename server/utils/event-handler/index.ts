import {
  defineEventHandler,
  type H3Event,
  createError,
} from 'h3';
import { useLogger } from '#imports';

export interface DefineSafeEventHandlerOptions {
  errorText?: string;
  errorStatusCode?: number;
}

export function defineSafeEventHandler<T>(
  handler: (event: H3Event) => T,
  {
    errorText = 'An error occurred',
    errorStatusCode = 500,
  }: DefineSafeEventHandlerOptions = {},
) {
  return defineEventHandler(async (event) => {
    const logger = useLogger();

    try {
      return await handler(event);
    } catch (error: any) {
      if (error.statusCode) throw error;

      logger.error('Error in event handler:', error);

      throw createError({
        statusCode: errorStatusCode,
        message: errorText,
        data:
          process.env.SQX_STAGE === 'production'
            ? undefined
            : error,
      });
    }
  });
}
