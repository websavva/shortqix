import { defineMailTemplate } from '../utils';

import Component from './Component';

export const WelcomeMailTemplate = defineMailTemplate(
  Component,
  () => {
    return `Welcome to ${process.env.SQX_APP_NAME}`;
  },
);
