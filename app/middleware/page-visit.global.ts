import {
  defineNuxtRouteMiddleware,
  useLogger,
  useRequestFetch,
} from '#imports';

export default defineNuxtRouteMiddleware(({ fullPath }) => {
  if (import.meta.server) {
    const logger = useLogger();

    const localFetch = useRequestFetch();

    localFetch('/api/visit', {
      method: 'POST',
      body: { url: fullPath },
    }).catch((err) => {
      logger.error('Failed to track page visit:', err);
    });
  }
});
