import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from 'dotenv';

config();

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  public readonly redisConnectionOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  }
  constructor() {
    // const redisHost = process.env.REDIS_HOST || 'localhost'; // Default to 'localhost' if not provided
    // const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10); // Convert string to number with default value 6379

    this.redisClient = new Redis(this.redisConnectionOptions);
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async getJsonValue<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async setJsonValue<T>(key: string, value: T, expirationInSeconds?: number): Promise<void> {
    const jsonValue = JSON.stringify(value);
    if (expirationInSeconds) {
      await this.redisClient.set(key, jsonValue, 'EX', expirationInSeconds);
    } else {
      await this.redisClient.set(key, jsonValue);
    }
  }
}
