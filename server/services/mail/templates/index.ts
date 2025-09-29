import { MagicLinkMailTemplate } from './MagicLink';
import { WelcomeMailTemplate } from './Welcome';
import { PremiumPurchaseMailTemplate } from './PremiumPurchase';

export const mailTemplates = {
  'magic-link': MagicLinkMailTemplate,
  welcome: WelcomeMailTemplate,
  'premium-purchase': PremiumPurchaseMailTemplate,
};

export type MailTemplateName = keyof typeof mailTemplates;
