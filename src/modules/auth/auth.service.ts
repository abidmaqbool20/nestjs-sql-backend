import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GeneralHelper } from '../global/helper/general.helper.service'
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { AuthRepository } from './auth.repository';
import { NotificationService } from '../global/notifications/notification.service';
import { EmailService } from '../global/emails/email.service';
import { EmailTypes } from '../global/emails/email-types.enum';
import { NotificationType } from '../global/notifications/notification-type.enum';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly helper: GeneralHelper,
    private readonly notification: NotificationService,
    private readonly emailService: EmailService,
  ) {}

  async login(data: LoginDto) {
    let result = this.authRepository.login(data);
    if(result){

      let emailData = {
          to: 'abidmaqbool20@gmail.com',
          template: 'welcome',
          data: {text : 'You have logged in to the application. ', name: 'Abid'},
          subject: 'Login Successfulll. ',
      };
      // this.emailService.sendMail(EmailTypes.WelcomeEmail,emailData);
      this.notification.sendNotification(NotificationType.WebPush,result);
      this.notification.sendNotification(NotificationType.Email,emailData);
    }
    return result;
  }



  async register(data: RegisterUserDto) {
    return this.authRepository.register(data);
  }

  async logout(token : string, data : any) {
    return this.authRepository.logout(token);
  }



}
