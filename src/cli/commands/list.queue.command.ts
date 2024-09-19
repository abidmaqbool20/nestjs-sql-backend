import { Injectable } from '@nestjs/common';
import { RedisService } from '../../modules/global/cache/redis.service';
import Redis from 'ioredis';
import { ModuleRef } from '@nestjs/core';
import { Command } from '../command.interface';

@Injectable()
export class ListQueueCommand implements Command{
  private redisClient: Redis;
  private redisService = new RedisService();

  constructor(private readonly moduleRef: ModuleRef) {
    this.redisClient = this.redisService.getClient();
  }


  async execute(): Promise<any>{
    try {
      const keys = await this.redisClient.keys('bull:*:id');
      let queueNames = keys.map(key => key.split(':')[1]);
      queueNames = [...new Set(queueNames)]; // Return unique queue names
      console.log(queueNames);

    } catch (error) {
      console.error(`Failed to empty queue "${name}": ${error.message}`);
    }
  }


}
