import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import Mail = require('nodemailer/lib/mailer');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD,
      },
    });
  }

  async sendMemberJoinVerification(emailAddress: string, signupVerifyToken: string) {
    const baseUrl = process.env.EMAIL_BASE_URL;

    const url = `${baseUrl}/auth/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`이메일 전송에 실패했습니다: ${error.message}`);
    }
  }
}
