import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log(`SMTP Mailer initialized with host: ${smtpHost}`);
    } else {
      this.logger.warn(
        'SMTP credentials not fully provided. Falling back to Console Mailer mode for development.',
      );
    }
  }

  async sendVerificationEmail(to: string, url: string, token: string): Promise<void> {
    const from = this.configService.get<string>('MAIL_FROM') || 'noreply@hackathon.local';
    const subject = 'Verify your email address';
    const text = `Please verify your email by clicking the link below or using code ${token}:\n\n${url}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Verify Your Email</h2>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <p><a href="${url}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>Or paste this URL in your browser: <code>${url}</code></p>
        <p>Verification Code: <strong>${token}</strong></p>
      </div>
    `;

    if (this.transporter) {
      await this.transporter.sendMail({ from, to, subject, text, html });
      this.logger.log(`Verification email sent to ${to}`);
    } else {
      this.logger.log(`[DEV MAIL] Verification Email to: ${to}`);
      this.logger.log(`[DEV MAIL] URL: ${url}`);
      this.logger.log(`[DEV MAIL] Token: ${token}`);
    }
  }

  async sendPasswordResetEmail(to: string, url: string, token: string): Promise<void> {
    const from = this.configService.get<string>('MAIL_FROM') || 'noreply@hackathon.local';
    const subject = 'Reset your password';
    const text = `You requested a password reset. Click the link below or use token ${token}:\n\n${url}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <p><a href="${url}" style="background-color: #DC2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>Or paste this URL in your browser: <code>${url}</code></p>
        <p>Reset Token: <strong>${token}</strong></p>
      </div>
    `;

    if (this.transporter) {
      await this.transporter.sendMail({ from, to, subject, text, html });
      this.logger.log(`Password reset email sent to ${to}`);
    } else {
      this.logger.log(`[DEV MAIL] Password Reset Email to: ${to}`);
      this.logger.log(`[DEV MAIL] URL: ${url}`);
      this.logger.log(`[DEV MAIL] Token: ${token}`);
    }
  }
}
