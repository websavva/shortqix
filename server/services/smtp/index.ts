import { createTransport } from 'nodemailer';

const createSMTPransport = () => {
  const isDev = process.env.NODE_ENV !== 'production';

  const authOptions = !isDev
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined;

  const transport = createTransport({
    port: +process.env.SMTP_PORT!,
    host: process.env.SMTP_HOST!,
    auth: authOptions,
    secure: !isDev,
  });

  return transport;
};

export const smtpTransport = createSMTPransport();
