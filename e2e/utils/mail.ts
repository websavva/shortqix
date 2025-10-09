import { $fetch } from 'ofetch';

export interface MailItem {
  id: string;
  dateSent: string;
  fromAddress: string;
  toAddresses: string[];
  subject: string;
  xmailer: string;
  mimeVersion: string;
  body: string;
  contentType: string;
  boundary: string;
  attachments: any[];
  transferEncoding: string;
  Message: any;
  InlineAttachments: any;
  TextBody: string;
  HTMLBody: string;
}

export interface MailResponse {
  mailItems: MailItem[];
  totalRecords: number;
  totalPages: number;
}

const smtpServerUrl = 'http://localhost:8085';

export async function getMails(): Promise<{
  mailItems: MailItem[];
  totalRecords: number;
  totalPages: number;
}> {
  const mails = await $fetch<MailResponse>('/mail', {
    query: {
      pageNumber: 1,
      orderby: 'date',
      dir: 'desc',
    },
    baseURL: smtpServerUrl,
  });

  return mails;
}

export async function findMail(
  subject: string,
  to: string,
): Promise<MailItem | null> {
  const mails = await getMails();

  return (
    mails.mailItems.find(
      (mail) =>
        mail.subject === subject &&
        mail.toAddresses.includes(to),
    ) || null
  );
}

export async function deleteMail(): Promise<void> {
  await $fetch('/mail', {
    method: 'DELETE',
    body: {
      pruneCode: 'all',
    },
    baseURL: smtpServerUrl,
  });
}
