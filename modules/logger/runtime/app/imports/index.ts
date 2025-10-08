import { useNuxtApp } from '#app';

export const useLogger = () => useNuxtApp().$logger;
