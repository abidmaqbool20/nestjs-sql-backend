import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UsersRepository } from './users.repository';
import { RedisService } from '../../cache/redis.service';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly module = 'users';
  private readonly cacheDuration = 36000; // Cache duration in seconds

  constructor(
    private readonly repository: UsersRepository,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    // Initialization if needed
  }

  // Create a record
  async create(data: CreateDto): Promise<User> {
    const cacheKey = `${this.module}-findAll`;
    let created = await this.repository.create(data);
    if (created) {
      await this.redisService.getClient().del(cacheKey);
    }
    return created;
  }

  // Fetch all listings
  async findAll(): Promise<User[]> {
    const cacheKey = `${this.module}-findAll`;
    let result = await this.redisService.getJsonValue<User[]>(cacheKey);

    if (!result) {
      result = await this.repository.findAll();
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration);
    }

    return result;
  }

  // Find Single Record
  async findOne(id: bigint): Promise<User> {
    const cacheKey = `${this.module}-findOne-${id}`;
    let result = await this.redisService.getJsonValue<User>(cacheKey);

    if (!result) {
      result = await this.repository.findOne(id);
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration);
    }

    return result;
  }

  // Find by Username
  async findByUsername(username: string): Promise<User> {
    const cacheKey = `${this.module}-findByUsername-${username}`;
    let result = await this.redisService.getJsonValue<User>(cacheKey);

    if (!result) {
      result = await this.repository.findByUsername(username);
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration);
    }

    return result;
  }

  // Update record
  async update(id: bigint, userData: UpdateDto): Promise<User> {
    let result = await this.repository.update(id, userData);

    const cacheKeyFindAll = `${this.module}-findAll`;
    const cacheKeyFindOne = `${this.module}-findOne-${id}`;

    await this.redisService.getClient().del(cacheKeyFindAll);
    await this.redisService.getClient().del(cacheKeyFindOne);

    return result;
  }

  // Delete a record
  async remove(id: bigint): Promise<boolean> {
    const cacheKey = `${this.module}-findOne-${id}`;
    const result = await this.repository.remove(id);
    await this.redisService.getClient().del(cacheKey);
    return result ? true : false;
  }
}
