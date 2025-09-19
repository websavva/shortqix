import {
  defineNuxtPlugin,
  useAuth,
  watch,
  useNuxtApp,
  getCurrentScope,
} from '#imports';

import { WsService } from '@/services/ws';
import { onWsEvent } from '@/composables/onWsEvent';
import { WsEventTypes } from '#shared/consts/ws-event-types';

const PREMIUM_UPDATE_EVENTS = [
  WsEventTypes.PREMIUM_PURCHASE,
  WsEventTypes.PREMIUM_EXPIRATION,
] as const;

export default defineNuxtPlugin(async () => {
  const $nuxtApp = useNuxtApp();
  const currentScope = getCurrentScope();

  let isNuxtReady: boolean = false;

  const { fetchUser, user, updateUser } = useAuth();

  if (import.meta.server) {
    // fetch user on server
    await fetchUser();
  } else {
    // websocket service setup and update
    // depending on the user's id
    watch(
      () => user.value?.id,
      (newUserId) => {
        if (!isNuxtReady) return;

        if (newUserId) {
          if (!$nuxtApp.$wsService.value) {
            $nuxtApp.$wsService.value =
              WsService.create(newUserId);
          } else {
            const newWsService = WsService.from(
              newUserId,
              $nuxtApp.$wsService.value.listenersMap,
            );

            $nuxtApp.$wsService.value.destroy();

            $nuxtApp.$wsService.value = newWsService;
          }
        } else if ($nuxtApp.$wsService.value) {
          $nuxtApp.$wsService.value.destroy();

          $nuxtApp.$wsService.value = null;
        }
      },
    );

    // premium purchase and expiration events listeners
    $nuxtApp.hook('app:suspense:resolve', () => {
      isNuxtReady = true;

      if (user.value && !$nuxtApp.$wsService.value) {
        $nuxtApp.$wsService.value = WsService.create(
          user.value.id,
        );
      }

      currentScope?.run(() => {
        PREMIUM_UPDATE_EVENTS.forEach((event) => {
          onWsEvent(event, updateUser);
        });
      });
    });
  }
});
