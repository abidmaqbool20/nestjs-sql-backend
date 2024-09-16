import { Module, forwardRef, Global  } from '@nestjs/common';
import {EmailService} from "./email.service"
import { WelcomeEmail } from './classes/welcome.email';
@Global()
@Module({
  imports: [],
  providers: [
    EmailService,
    WelcomeEmail
  ],
  controllers: [],
  exports: [EmailService],
})
export class EmailModule {}
