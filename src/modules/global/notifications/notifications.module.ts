// src/notifications/notifications.module.ts
import { Module, Global } from '@nestjs/common';
import { EmailNotification } from './notification.email';
import { WebPushNotification } from './notification.web-push';
import { NotificationType } from './notification-type.enum';
import { NotificationService } from './notification.service';

@Global()
@Module({
  providers: [
    EmailNotification,
    WebPushNotification,
    NotificationService,
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
