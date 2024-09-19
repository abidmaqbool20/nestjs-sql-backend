// src/notifications/cap.service.ts
import { Injectable } from '@nestjs/common';
import { EmailNotification } from './notification.email';
import { WebPushNotification } from './notification.web-push';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailNotification: EmailNotification,
    private readonly webPushNotification: WebPushNotification,
) {}

  async sendNotification(type: NotificationType, data: any): Promise<void> {
    switch (type) {
      case NotificationType.Email:
        await this.emailNotification.send(data);
        break;
      case NotificationType.WebPush:
        await this.webPushNotification.send(data);
        break;
      default:
        throw new Error('Invalid notification type');
    }
  }
}
