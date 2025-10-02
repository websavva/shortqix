import { defineMailTemplate } from '../utils';

import Component from './Component';

export const PremiumPurchaseMailTemplate =
  defineMailTemplate(
    Component,
    () => `Premium purchase successful`,
  );
