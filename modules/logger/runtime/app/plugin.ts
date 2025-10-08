import { createConsola, LogTypes } from 'consola';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const {
    $config: {
      public: {
        logger: { logLevel },
      },
    },
  } = nuxtApp;

  const logger = createConsola({
    level: LogTypes[logLevel].level,
  });

  return {
    provide: {
      logger,
    },
  };
});
