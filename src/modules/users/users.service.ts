import { Injectable, OnModuleInit } from '@nestjs/common';  
import { User } from './entities/user.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UsersRepository } from './users.repository';
import { CacheService } from '@/cache/node.cache';
import { GeneralHelper } from '@/helpers/general.helper';  
import { CacheKeysService } from '@/global/cache-keys.service';

@Injectable()
export class UsersService implements OnModuleInit {   
  constructor(
    private readonly cacheKeysService: CacheKeysService,
    private readonly repository: UsersRepository, 
    private readonly cacheService: CacheService
  ) {}

  async onModuleInit() {   
    // Initialization if needed
  }  

  //Create a record
  async create(data: CreateDto) {  
    let created = await this.repository.create(data);
    if(created){
      let cacheKey = this.cacheKeysService.getCacheKeyByMethodName('findAll');
      this.cacheService.del(cacheKey);  
    }
  }  

  //Fetch all listings
  async findAll() {
    let cacheKey = this.cacheKeysService.getCacheKeyByMethodName('findAll');
    if (!this.cacheService.has(cacheKey)) { 
      let result = await this.repository.findAll();
      this.cacheService.set(cacheKey, result, 36000); 
    }
    return this.cacheService.get(cacheKey);  // Remove type argument here
  }

  //Find Single Record
  async findOne(id: bigint) {
    let cacheKey = this.cacheKeysService.getCacheKeyByMethodName('findOne', id);
    if (!this.cacheService.has(cacheKey)) { 
      let result = await this.repository.findOne(id);
      this.cacheService.set(cacheKey, result, 36000); 
    }
    return this.cacheService.get(cacheKey);  // Remove type argument here
  }

  //Find by Username
  async findByUsername(username: string) {
    let cacheKey = this.cacheKeysService.getCacheKeyByMethodName('findByUsername', username);
    if (!this.cacheService.has(cacheKey)) { 
      let result = await this.repository.findByUsername(username); 
      this.cacheService.set(cacheKey, result, 36000); 
    }
    return this.cacheService.get(cacheKey);  // Remove type argument here
  }

  //Update record
  async update(id: bigint, userData: UpdateDto): Promise<void> {
    await this.repository.update(id, userData);
    
    const findAllCacheKey = this.cacheKeysService.getCacheKeyByMethodName('findAll');
    this.cacheService.del(findAllCacheKey);

    const findOneCacheKey = this.cacheKeysService.getCacheKeyByMethodName('findOne', id.toString());
    this.cacheService.del(findOneCacheKey);
  
  }

  //Delete a record
  async remove(id: bigint): Promise<void> { 
    await this.repository.remove(id);
    const cacheKey = this.cacheKeysService.getCacheKeyByMethodName('findOne', id.toString()); 
    this.cacheService.del(cacheKey);  
  }
}
