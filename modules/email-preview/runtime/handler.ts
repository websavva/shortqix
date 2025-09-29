import { defineEventHandler, setResponseHeader } from 'h3';

import { mailTemplates } from '#server/services/mail/templates';
import { getParsedQuery } from '#server/utils/query';
import type { MailTemplateResult } from '#server/services/mail/templates/utils';

interface TemplateProps {
  template: keyof typeof mailTemplates;
  type?: keyof MailTemplateResult;
  [key: string]: any;
}

export default defineEventHandler(async (event) => {
  const {
    template,
    type = 'html',
    ...templateProps
  } = getParsedQuery(event) as TemplateProps;

  const { [type]: result } = await mailTemplates[template](
    templateProps as any,
  );

  const contentType =
    type === 'html' ? 'text/html' : 'text/plain';

  setResponseHeader(event, 'Content-Type', contentType);

  return result;
});
