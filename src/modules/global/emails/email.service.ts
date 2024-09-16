import { Injectable } from '@nestjs/common';
import {WelcomeEmail} from "./classes/welcome.email"
import { EmailTypes } from './email-types.enum';
@Injectable()
export class EmailService {

  constructor(private readonly welcomeEmail:WelcomeEmail) {
  }

  async sendMail(type:String, data:any): Promise<Boolean> {
    let sent = null;
    switch(type){
        case EmailTypes.WelcomeEmail:
            sent = await this.welcomeEmail.send(data);
            break;
        default:
            throw new Error('Invalid email type');
    }

    return sent;
  }

}
