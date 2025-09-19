import { defineNuxtPlugin, shallowRef } from '#imports';

import type { WsService } from '@/services/ws';

export default defineNuxtPlugin(() => {
  const wsService = shallowRef<WsService | null>(null);

  return {
    provide: {
      wsService,
    },
  };
});
