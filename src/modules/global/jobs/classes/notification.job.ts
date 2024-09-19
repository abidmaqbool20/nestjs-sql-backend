import { QueuableJob } from '../job.interface';
import { EmailNotification } from '../../notifications/notification.email';
import { NotificationType } from '../../enums/notification-type.enum';
import { Inject, Injectable, Optional } from '@nestjs/common';

@Injectable()
export class NotificationJob implements QueuableJob {
  public queue = 'notifications';
  public shouldQueue = true;
  public data:any = null;

  constructor(
    @Optional() private emailNotification: EmailNotification = undefined
  ) {
  }

  async handle(): Promise<void> {
    let jobData = this.data;

    if (!jobData.notifications || !jobData.notifications.length) {
      jobData.notifications = [NotificationType.Email];
    }

    jobData.notifications.forEach((notificationType) => {
      if (notificationType === NotificationType.Email) {
        this.emailNotification.send(jobData);
      }
    });
  }
}
