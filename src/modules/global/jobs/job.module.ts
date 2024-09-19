import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobService } from './job.service';
import { DefaultJobProcessor } from './default-job.processor';
import { NotificationsJobProcessor } from './notifications-job.processor';
import { JobExecutionService } from './job-execution.service';
import { EmailNotification } from '../notifications/notification.email';
import { NotificationJob } from './classes/notification.job';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'default',
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [
    JobService,
    DefaultJobProcessor,
    NotificationsJobProcessor,
    JobExecutionService,
    EmailNotification,
    NotificationJob
  ],
  exports: [JobService,DefaultJobProcessor,NotificationsJobProcessor],
})
export class JobModule {}
