import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { IEmailService } from '@app/shared/domain/adepters/email.interface';

@Injectable()
export class MailerService implements IEmailService {
  private readonly transport: nodemailer.Transporter<SentMessageInfo>;

  constructor(private readonly emailConfig: EnvironmentConfigService) {
    this.transport = nodemailer.createTransport({
      host: this.emailConfig.getEmailHost(),
      port: this.emailConfig.getEmailPort(),
      secure: false,
      auth: {
        user: this.emailConfig.getEmailUser(),
        pass: this.emailConfig.getEmailSecret(),
      },
    });
  }
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.emailConfig.getEmailSender(),
        to,
        subject,
        text: body,
        html: body,
      };

      const info = await this.transport.sendMail(mailOptions);

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return true;
    } catch (err) {
      return false;
    }
  }
}
