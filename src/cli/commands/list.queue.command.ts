import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import Redis from 'ioredis';
import { Command } from '../command.interface';
import { RedisService } from '../../modules/global/cache/redis.service';

@Injectable()
export class ListQueueCommand implements Command {
  private redisClient: Redis;

  constructor(private readonly moduleRef: ModuleRef) {
    const redisService = this.moduleRef.get(RedisService, { strict: false });
    this.redisClient = redisService.getClient();
  }

  async execute(): Promise<void> {
    try {
      const keys = await this.redisClient.keys('bull:*:id');

      const queueNames = [
        ...new Set(keys.map(key => key.split(':')[1])),
      ];

      console.log(queueNames.length ? queueNames : 'No queues found');
    } catch (error: any) {
      console.error(`Failed to list queues: ${error.message}`);
    }
  }
}

/**
 * 👇 Commander auto-discovery metadata
 */
export default {
  name: 'list-queues',
  description: 'List all Bull queues',
  handler: ListQueueCommand,
};
