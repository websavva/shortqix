import { useNuxtApp } from 'nuxt/app';

import type { ErrorTrack } from './types';

export * from './dto';
export * from './types';

export const useTrackError = (): ErrorTrack => {
  const nuxtApp = useNuxtApp();

  return nuxtApp.$trackError;
};
