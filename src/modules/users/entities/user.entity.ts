import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CreateDto } from '../dto/create.dto';
import { GeneralHelper } from '@/helpers/general.helper';

@Entity('users')   
export class User {
  
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;  

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  
  static async newInstanceFromDTO(data: CreateDto): Promise<User> {
    const result = new User();
    result.name = data.name;
    result.email = data.email;
    result.password = data.password;
    result.created_at = data.created_at || new Date();
    result.updated_at = new Date();
    return result;
  } 

}
