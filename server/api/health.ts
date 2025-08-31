import { defineEventHandler } from 'h3';

declare module 'nitropack/types' {
  interface NitroApp {
    isReady: boolean;
  }
}

export default defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();

  if (!nitroApp.isReady) {
    throw createError({
      statusCode: 500,
      message: 'Server is not ready',
    });
  }

  return {
    status: 'ok',
  };
});
