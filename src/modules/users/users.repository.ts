import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
      @InjectRepository(User)
      private readonly UserModel: Repository<User>
  ) {}

  // Create a record
  async create(data: CreateDto): Promise<User> {
    const user = await User.newInstanceFromDTO(data);
    return this.UserModel.save(user);
  }

  // Fetch all listings
  async findAll(): Promise<User[]> {
    return this.UserModel.find({relations: ['roles']});
  }

  // Find Single Record
  async findOne(id: bigint): Promise<User> {
    const user = await this.UserModel.findOne({ where : {id : id}, relations: ['roles'] });
    if (!user) {
      throw new NotFoundException('Record not found');
    }
    return user;
  }

  // Find by Username
  async findByUsername(username: string): Promise<User> {
    const user = await this.UserModel.findOne({ where : {email : username}, relations: ['roles'] });
    if (!user) {
      throw new NotFoundException('Record not found');
    }
    return user;
  }

  // Update record
  async update(id: bigint, userData: UpdateDto): Promise<Boolean> {
    let result = false;
    const user = await this.findOne(id);
    if (user) {
      let updated = await this.UserModel.update(id.toString(), userData);
      result = updated ? true : false;
    }
    return result;
  }

  // Delete a record
  async remove(id: bigint): Promise<Boolean> {
    let result = false;
    const record = await this.findOne(id);
    if (record) {
      let deleted = await this.UserModel.delete(id.toString());
      result = deleted ? true : false;
    }
    return result;
  }
}
