import { Injectable } from '@nestjs/common';
import { GeneralHelper } from '../../helper/general.helper.service';

@Injectable()
export class WelcomeEmail {

  constructor(private readonly helper:GeneralHelper) {
  }

  async send(data:any): Promise<Boolean>{
    return this.helper.sendMail(data);
  }

}
