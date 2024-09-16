// src/notifications/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Notification } from './notification.interface';
import { GeneralHelper } from '../helper/general.helper.service';
import * as webPush from 'web-push';
import { config } from 'dotenv';

config();

@Injectable()
export class WebPushNotification implements Notification {
  constructor(private readonly helper: GeneralHelper) {
    webPush.setVapidDetails(
      'mailto:abidmaqbool20@@gmail.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  }

  async send(parameters:any): Promise<Boolean>{
    let result = null;
    const {subscription, payload} = parameters;
    if(subscription && payload){
      result = await webPush.sendNotification(subscription, payload);
    }

    return result ? true : false;
  }
}
