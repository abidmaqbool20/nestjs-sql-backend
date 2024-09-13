import { Injectable, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(parameters: { to: string; subject: string; template: string; data: any }) {
    const { to, subject, template, data } = parameters;

    if (!to) {
      throw new BadRequestException('Recipient email ("to") is required.');
    }

    if (!template) {
      throw new BadRequestException('Email template is required.');
    }

    // Send email if validation passes
    return await this.mailerService.sendMail({
      to,
      subject: subject ?? '', // Set default subject if not provided
      template,
      context: data ?? {},    // Default to an empty object if no data provided
    });
  }
}
