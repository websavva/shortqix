import {
  defineNuxtPlugin,
  useRequestFetch,
  useRequestURL,
} from 'nuxt/app';

import type { ErrorLogDto, ErrorTrack } from './imports';

function getStack() {
  const obj: { stack?: string } = {};
  if ('captureStackTrace' in Error) {
    // Avoid getStack itself in the stack trace
    Error.captureStackTrace(obj, getStack);
  }
  return obj.stack || '';
}

export default defineNuxtPlugin((nuxtApp) => {
  const localFetch = useRequestFetch();

  const trackError: ErrorTrack = async (
    error: Error,
    { type = 'global' }: Partial<ErrorLogDto> = {},
  ) => {
    if (!nuxtApp.$config.public.bugTracker.enabled) return;

    const url = useRequestURL({
      xForwardedHost: true,
      xForwardedProto: true,
    }).toString();

    const reqBody: ErrorLogDto = {
      type,
      message: error.message,
      stack: error.stack || getStack(),
      url,
      env: import.meta.server ? 'server' : 'client',
    };

    await localFetch('/api/error-logs', {
      method: 'POST',
      body: reqBody,
    }).catch((err) => {
      // @ts-expect-error - logger is not typed here in modules
      nuxtApp.$logger?.error('Failed to track error:', err);
    });
  };

  nuxtApp.vueApp.config.errorHandler = (err, vm, info) => {
    if (err instanceof Error) {
      trackError(err, {
        type: 'vue',
        message: [err.message, vm?.$options.name, info]
          .filter(Boolean)
          .join(' | '),
      });
    }
  };

  if (import.meta.client) {
    window.addEventListener('error', (event) => {
      trackError(event.error, {
        type: 'global',
      });
    });

    window.addEventListener(
      'unhandledrejection',
      (event) => {
        if (event.reason instanceof Error) {
          trackError(event.reason, {
            type: 'promise',
          });
        }
      },
    );
  }

  return {
    provide: {
      trackError,
    },
  };
});
