import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UsersRepository } from './users.repository';
import { CacheService } from '@/cache/node.cache';
import { GeneralHelper } from '@/helpers/general.helper';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly module = 'users';
  constructor(
    private readonly repository: UsersRepository,
    private readonly cacheService: CacheService
  ) {}

  async onModuleInit() {
    // Initialization if needed
  }

  //Create a record
  async create(data: CreateDto): Promise<Boolean>  {
    const cacheKey = this.module+"-findAll";
    let created = await this.repository.create(data);
    if(created){
      this.cacheService.del(cacheKey);
    }
    return created ? true : false;
  }

  //Fetch all listings
  async findAll(): Promise<User[]>  {
    const cacheKey = this.module+"-findAll";
    if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findAll();
      this.cacheService.set(cacheKey, result, 36000);
    }
    return this.cacheService.get(cacheKey);
  }

  //Find Single Record
  async findOne(id: bigint): Promise<User>  {
    const cacheKey = this.module+"-findOne-"+id;
    if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findOne(id);
      this.cacheService.set(cacheKey, result, 36000);
    }
    return this.cacheService.get(cacheKey);
  }

  //Find by Username
  async findByUsername(username: string): Promise<User> {
    const cacheKey = this.module+"-findByUsername-"+username;
    if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findByUsername(username);
      this.cacheService.set(cacheKey, result, 36000);
    }
    return this.cacheService.get(cacheKey);
  }

  //Update record
  async update(id: bigint, userData: UpdateDto): Promise<Boolean> {

    let result = await this.repository.update(id, userData);

    const cacheKey = this.module+"-findAll";
    this.cacheService.del(cacheKey);

    const findOneCacheKey = this.module+"-findByUsername-"+id.toString();
    this.cacheService.del(findOneCacheKey);

    return result;

  }

  //Delete a record
  async remove(id: bigint): Promise<Boolean> {
    const cacheKey = this.module+"-findOne-"+id.toString();
    let result = await this.repository.remove(id);
    this.cacheService.del(cacheKey);
    return result;
  }
}
