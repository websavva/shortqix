import {
  createTransport,
  type Transporter,
  type SendMailOptions,
} from 'nodemailer';

import {
  mailTemplates,
  type MailTemplateName,
} from './templates';

export class MailService {
  static transport: Transporter;

  static async setup() {
    console.log('📧 Setting up SMTP transport...');

    const isDev = process.env.NODE_ENV !== 'production';

    const authOptions = !isDev
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      : undefined;

    this.transport = createTransport({
      port: +process.env.SMTP_PORT!,
      host: process.env.SMTP_HOST!,
      auth: authOptions,
      secure: !isDev,
    });

    await this.verify();

    console.log(
      `✅ SMTP transport configured for ${
        isDev ? 'development' : 'production'
      } mode`,
    );
  }

  static async verify() {
    try {
      console.log('🔍 Verifying SMTP connection...');
      await this.transport.verify();
      console.log(
        '✅ SMTP connection verified successfully',
      );
    } catch (error) {
      console.error('❌ SMTP verification failed:', error);
      throw error;
    }
  }

  static async sendMail(options: SendMailOptions) {
    try {
      console.log(`📤 Sending email to: ${options.to}`);

      const result = await this.transport.sendMail({
        from: process.env.SMTP_FROM,
        ...options,
      });

      console.log(
        `✅ Email sent successfully to ${options.to}`,
      );
      return result;
    } catch (error) {
      console.error(
        `❌ Failed to send email to ${options.to}:`,
        error,
      );
      throw error;
    }
  }

  static async sendMailTemplate<T extends MailTemplateName>(
    template: T,
    {
      props,
      ...options
    }: SendMailOptions & {
      props: Parameters<(typeof mailTemplates)[T]>[0];
    },
  ) {
    const { subject, html, text } = await mailTemplates[
      template
    ](props);

    return this.sendMail({
      ...options,
      subject,
      html,
      text,
    });
  }

  static async cleanup() {
    try {
      console.log('🔄 Closing SMTP transport...');
      this.transport.close();
      console.log('✅ SMTP transport closed successfully');
    } catch (error) {
      console.error(
        '❌ Error closing SMTP transport:',
        error,
      );
    }
  }

  static getStatus() {
    return {
      isConfigured: !!this.transport,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.NODE_ENV === 'production',
    };
  }
}
