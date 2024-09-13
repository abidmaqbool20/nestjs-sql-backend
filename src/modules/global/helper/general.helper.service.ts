import { Injectable, HttpStatus, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../cache/redis.service';
import { MailService } from '../mailer/mail.service';

@Injectable()
export class GeneralHelper {

  private redisService:RedisService;
  constructor(private readonly mailService: MailService) {
    this.redisService = new RedisService();
  }


  // async onModuleInit() {
  //   this.redisService = new RedisService();
  // }


  async sendMail(parameters:any): Promise<Boolean>{
    return this.mailService.sendEmail(parameters);
  }

  static async getUUID(): Promise<string> {
    return await uuidv4();
  }

  static async encrypt(content: string, algorithm: string = 'bcrypt'): Promise<string> {
    if (algorithm === 'bcrypt') {
      return await bcrypt.hash(content, 10);
    }
    return content;
  }

  static async unprotectedRoutes(): Promise<string[]> {
    return [
      '/auth/login',
      '/auth/register',
    ];
  }

  async delCache(keys:string[]) : Promise<Boolean> {
    let deleted = null;
    if(keys.length){
      keys.forEach( async (key) => {
        deleted = await this.redisService.getClient().del(key);
      })
    }

    return deleted ? true : false
  }


  async doCache(cacheKey:string, data, cacheDuration=36000) : Promise<void> {
    await this.redisService.setJsonValue(cacheKey, data, cacheDuration);
  }

  async getCache<T>(key: string): Promise<T | null> {
    return await this.redisService.getJsonValue(key);
  }

}
