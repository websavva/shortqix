import { createConsola, LogTypes } from 'consola';
import { useRuntimeConfig } from '#imports';
import type { RuntimeConfig } from 'nuxt/schema';

const config = useRuntimeConfig() as RuntimeConfig;

const {
  public: {
    logger: { logLevel },
  },
} = config;

const logger = createConsola({
  level: LogTypes[logLevel].level,
});

export const useLogger = () => logger;
