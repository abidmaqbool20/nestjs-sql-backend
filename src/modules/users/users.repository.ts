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
    return this.UserModel.find();
  }

  // Find Single Record
  async findOne(id: bigint): Promise<User> {
    const user = await this.UserModel.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Record not found');
    }
    return user;
  }

  // Find by Username
  async findByUsername(username: string): Promise<User> {
    const user = await this.UserModel.findOneBy({ email: username });
    if (!user) {
      throw new NotFoundException('Record not found');
    }
    return user;
  }

  // Update record
  async update(id: bigint, userData: UpdateDto): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await this.UserModel.update(id.toString(), userData);
    }
  }

  // Delete a record
  async remove(id: bigint): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await this.UserModel.delete(id.toString());
    }
  }
}
