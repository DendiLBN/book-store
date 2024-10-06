import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async nodeSendEmail(to: string, token: string) {
    const resetLink = `http://localhost:5173/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: to,
      subject: 'Password Reset Request Book Store',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>You are receiving this email because you (or someone else) requested a password reset for your account.</p>
            <p>Please click on the link below, or paste this URL into your browser to complete the process:</p>
            <p>
                <a href="${resetLink}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">${resetLink}</a>
            </p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p>Thank you! Book Store!</p>
        </div>
    `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }
}
