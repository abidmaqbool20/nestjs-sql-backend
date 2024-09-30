import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GeneralHelper } from '../global/helper/general.helper.service'
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { AuthRepository } from './auth.repository';
import { NotificationService } from '../global/notifications/notification.service';
import { EmailService } from '../global/emails/email.service';
import { EmailTypes } from '../global/emails/email-types.enum';
import { NotificationType } from '../global/enums/notification-type.enum';
import { NotificationJob } from '../global/jobs/classes/notification.job';
import { JobService } from '../global/jobs/job.service';
@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly helper: GeneralHelper,
    // private readonly notification: NotificationService,
    // private readonly emailService: EmailService,
    private readonly jobService: JobService,
  ) {}

  async login(data: LoginDto) {
    let result = this.authRepository.login(data);
    if(result){

      let notificationData = {
          notifications : ['email'],
          to: 'abidmaqbool20@gmail.com',
          template: 'welcome',
          data: {text : 'You have logged in to the application. ', name: 'Abid'},
          subject: 'Login Successfulll. ',
      };

      // We can not make the data as dependency of the NotificationJob in our current structure. We need to set the data property on the instance of the class.
      const notificationJob = new NotificationJob();
      notificationJob.data = notificationData;
      await this.jobService.dispatch(notificationJob);

      // this.emailService.sendMail(EmailTypes.WelcomeEmail,emailData);
      // this.notification.sendNotification(NotificationType.WebPush,result);
      // this.notification.sendNotification(NotificationType.Email,notificationData);
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
