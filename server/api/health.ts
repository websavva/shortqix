import { defineEventHandler, createError } from 'h3';
import { useNitroApp } from 'nitropack/runtime';

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
