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

    const url = `${baseUrl}/api/v1/auth/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  text-align: center;
                  padding: 20px;
              }
      
              .container {
                  background-color: #fff;
                  margin: 0 auto;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  max-width: 500px;
              }
      
              button {
                  background-color: #4CAF50;
                  color: white;
                  padding: 15px 32px;
                  text-align: center;
                  text-decoration: none;
                  display: inline-block;
                  font-size: 16px;
                  margin: 4px 2px;
                  cursor: pointer;
                  border: none;
                  border-radius: 4px;
                  transition: 0.3s;
              }
      
              button:hover {
                  background-color: #45a049;
              }
      
              h1 {
                  color: #333;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>가입 인증 메일</h1>
              <p>가입확인 버튼을 누르시면 가입 인증이 완료됩니다.</p>
              <form action="${url}" method="POST">
                  <button type="submit">가입확인</button>
              </form>
          </div>
      </body>
      </html>      
      `,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`이메일 전송에 실패했습니다: ${error.message}`);
    }
  }
}
