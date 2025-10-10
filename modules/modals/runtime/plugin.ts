import { defineNuxtPlugin } from '#app';

import { createModalManager } from './imports/manager';

export default defineNuxtPlugin(() => {
  const modalManager = createModalManager();

  return {
    provide: {
      modal: modalManager,
    },
  };
});
