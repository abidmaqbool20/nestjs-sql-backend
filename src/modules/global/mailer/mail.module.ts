import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { config } from 'dotenv';
config();

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        // service: 'gmail', this line only useable if to use gmail mail service
        host: process.env.MAIL_HOST || 'localhost',
        port: process.env.MAIL_PORT || 587,
        secure: process.env.MAIL_SECURE || false, // Use true for 465, false for other ports (like 587)
        auth: {
          user: process.env.MAIL_USER || null,
          pass: process.env.MAIL_PASSWORD || null,
        },
        tls: {
          rejectUnauthorized: false, // Only set this to false if you're in a development environment
        },
      },
      defaults: {
        from: '"No Reply" <'+process.env.MAIL_FROM_ADDRESS+'>',
      },
      template: {
        dir: join(__dirname, '../../../templates/email'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class MailModule {}
