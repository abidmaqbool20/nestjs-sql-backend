import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UsersRepository } from './users.repository';
import { RedisService } from '../../cache/redis.service';
import { GeneralHelper } from '../../helpers/general.helper.service';
@Injectable()

export class UsersService {
  private readonly module = 'users';
  private readonly cacheDuration = 36000; // Cache duration in seconds

  constructor(
    private helper:GeneralHelper,
    private readonly repository: UsersRepository,
    private readonly redisService: RedisService,
  ) {}

  // async onModuleInit() {
  //   this.helper = new GeneralHelper;
  // }

  // Create a record
  async create(data: CreateDto): Promise<User> {
    let created = await this.repository.create(data);
    if (created) {
      await this.helper.delCache([`${this.module}-findAll`]);
    }
    return created;
  }

  // Fetch all listings
  async findAll(): Promise<User[]> {
    const cacheKey = `${this.module}-findAll`;
    let result = await this.helper.getCache<User[]>(cacheKey);

    if (!result) {
      result = await this.repository.findAll();
      await this.helper.doCache(cacheKey, result, this.cacheDuration);
    }

    return result;
  }

  // Find Single Record
  async findOne(id: bigint): Promise<User> {
    const cacheKey = `${this.module}-findOne-${id}`;
    let result = await this.helper.getCache<User>(cacheKey);

    if (!result) {
      result = await this.repository.findOne(id);
      await this.helper.doCache(cacheKey, result, this.cacheDuration);
    }

    return result;
  }

  // Find by Username
  async findByUsername(username: string): Promise<User> {
    const cacheKey = `${this.module}-findByUsername-${username}`;
    let result = await this.helper.getCache<User>(cacheKey);

    if (!result) {
      result = await this.repository.findByUsername(username);
      await this.helper.doCache(cacheKey, result, this.cacheDuration);
    }

    return result;
  }

  // Update record
  async update(id: bigint, userData: UpdateDto): Promise<User> {
    let result = await this.repository.update(id, userData);
    await this.helper.delCache([`${this.module}-findAll`, `${this.module}-findOne-${id}`]);
    return result;
  }

  // Delete a record
  async remove(id: bigint): Promise<boolean> {
    let status = false;
    let rec = await this.findOne(id);
    const result = await this.repository.remove(id);
    status = result ? true : false;
    if(status){
      await this.helper.delCache([`${this.module}-findOne-${id}`,`${this.module}-findByIds`,`${this.module}-findAll`,`${this.module}-findByName-${rec.name}`]);
    }
    return status;
  }
}
