import type { ModuleOptions } from './types';

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    logger: Required<ModuleOptions>;
  }
}
