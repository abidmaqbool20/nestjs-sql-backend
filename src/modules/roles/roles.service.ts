import { Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { RolesRepository } from './roles.repository';
import { RedisService } from '../../cache/redis.service';
import { GeneralHelper } from '../../helpers/general.helper.service';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly module = 'roles';
  private readonly cacheDuration = 36000;
  private helper:GeneralHelper;

  constructor(
    private readonly repository: RolesRepository,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.helper = new GeneralHelper;
  }


  // Create a record
  async create(data: CreateDto): Promise<Role> {
    const cacheKey = `${this.module}-findAll`;
    const result = await this.repository.create(data);
    if (result) {
      await this.helper.delCache([`${this.module}-findAll`]);
    }
    return result;
  }

  // Fetch all listings
  async findAll(): Promise<Role[]> {
    const cacheKey = `${this.module}-findAll`;
    let result = await this.helper.getCache<Role[]>(cacheKey);
    if (!result) {
      result = await this.repository.findAll();
      await this.helper.doCache(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Find Single Record
  async findOne(id: bigint): Promise<Role> {
    const cacheKey = `${this.module}-findOne-${id}`;
    let result = await this.helper.getCache<Role>(cacheKey);
    if (!result) {
      result = await this.repository.findOne(id);
      await this.helper.doCache(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Find by Name
  async findByName(name: string): Promise<Role> {
    const cacheKey = `${this.module}-findByName-${name}`;
    let result = await this.helper.getCache<Role>(cacheKey);
    if (!result) {
      result = await this.repository.findByName(name);
      await this.helper.doCache(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Update record
  async update(id: bigint, userData: UpdateDto): Promise<Role> {
    const result = await this.repository.update(id, userData);
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
