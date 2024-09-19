// src/notifications/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Notification } from './notification.interface';
import { GeneralHelper } from '../helper/general.helper.service';


@Injectable()
export class EmailNotification implements Notification {

  constructor(private readonly helper: GeneralHelper) {}

  async send(parameters:any): Promise<Boolean>{
    return await this.helper.sendMail(parameters);
  }
}
