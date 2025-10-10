import { useNuxtApp } from 'nuxt/app';

export * from './manager';

export const useModalManager = () => {
  const nuxtApp = useNuxtApp();

  return nuxtApp.$modal;
};
