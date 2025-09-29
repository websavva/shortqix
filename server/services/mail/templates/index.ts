import { MagicLinkMailTemplate } from './MagicLink';
import { WelcomeMailTemplate } from './Welcome';

export const mailTemplates = {
  'magic-link': MagicLinkMailTemplate,
  welcome: WelcomeMailTemplate,
};

export type MailTemplateName = keyof typeof mailTemplates;
