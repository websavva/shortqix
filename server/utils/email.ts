import { smtpTransport } from '../services/smtp';

export const sendMagicLinkEmail = async (
  email: string,
  token: string,
  baseUrl: string,
) => {
  const magicLink = `${baseUrl}/auth/verify?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Sign in to URL Shortener',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to URL Shortener!</h2>
        <p>Click the button below to sign in to your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicLink}" 
             style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Sign In
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${magicLink}" style="color: #3B82F6;">${magicLink}</a>
        </p>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 15 minutes and can only be used once.
        </p>
      </div>
    `,
  };

  try {
    await smtpTransport.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: 'Failed to send email',
    };
  }
};
