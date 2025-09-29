import { defineMailTemplate } from '../utils';

import Component from './Component.vue';

export const PremiumPurchaseMailTemplate =
  defineMailTemplate(
    Component,
    () => `Premium purchase successful`,
  );
