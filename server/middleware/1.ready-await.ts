import { defineEventHandler, createError } from 'h3';
import { useNitroApp } from 'nitropack/runtime';

const TIMEOUT = 30000;

export default defineEventHandler(async () => {
  const nitroApp = useNitroApp();

  if (!nitroApp.isReady) {
    console.log('⏳ Server not ready, waiting...');

    try {
      await waitForServerReadyWithBackoff(
        nitroApp,
        TIMEOUT,
      );
      console.log('✅ Server is now ready');
    } catch (error) {
      console.error(
        '❌ Server readiness timeout exceeded',
        error,
      );

      throw createError({
        statusCode: 503,
        message: 'Server is not ready after timeout',
      });
    }
  }
});

async function waitForServerReadyWithBackoff(
  nitroApp: any,
  timeoutMs: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkInterval = 100;

    const checkReady = () => {
      if (nitroApp.isReady) {
        resolve();
        return;
      }

      if (Date.now() - startTime > timeoutMs) {
        reject(
          new Error(
            `Server readiness timeout exceeded after ${timeoutMs}ms`,
          ),
        );
        return;
      }

      setTimeout(checkReady, checkInterval);
    };

    checkReady();
  });
}
