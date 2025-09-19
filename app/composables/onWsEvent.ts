import {
  useNuxtApp,
  watch,
  onMounted,
  onScopeDispose,
} from '#imports';
import {
  tryOnMounted,
  tryOnUnmounted,
  tryOnScopeDispose,
} from '@vueuse/core';

import type { WsEventListener } from '@/services/ws';
import type { WsEvents } from '#shared/consts/ws-event-types';

export function onWsEvent<E extends keyof WsEvents>(
  event: E,
  listener: WsEventListener<E>,
) {
  const wsService = useNuxtApp().$wsService;

  watch(wsService, (newWsService) => {
    if (newWsService) {
      newWsService.on(event, listener);
    }
  });

  tryOnMounted(() => {
    if (wsService.value) {
      wsService.value.on(event, listener);
    }
  });

  function tryRemoveListener() {
    wsService.value?.off(event, listener);
  }

  tryOnUnmounted(tryRemoveListener);

  tryOnScopeDispose(tryRemoveListener);
}
