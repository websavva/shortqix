import {
  createConsola,
  LogTypes,
  type LogType,
} from 'consola';
import { defineNuxtPlugin } from '#app';

function isValidLogLevel(
  logLevel: string,
): logLevel is LogType {
  return Object.keys(LogTypes).some(
    (levelName) => levelName === logLevel,
  );
}

export default defineNuxtPlugin((nuxtApp) => {
  const {
    $config: {
      public: {
        logger: { logLevel: defaultLogLevel },
      },
    },
  } = nuxtApp;

  const {
    _route: {
      query: { logLevel: rawLogLevel = '' },
    },
  } = nuxtApp;

  let logLevel: LogType;

  const routeLogLevel =
    (Array.isArray(rawLogLevel)
      ? rawLogLevel[0]
      : rawLogLevel) || '';

  if (isValidLogLevel(routeLogLevel)) {
    logLevel = routeLogLevel;
  } else {
    logLevel = defaultLogLevel;
  }

  const logger = createConsola({
    level: LogTypes[logLevel].level,
  });

  return {
    provide: {
      logger,
    },
  };
});
