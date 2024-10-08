import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateDto } from '../dto/create.dto';
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: bigint;

  @Column({  unique: true, type: 'varchar', nullable: false })
  name: string;



  static async newInstanceFromDTO(data: CreateDto): Promise<Permission> {
    const result = new Permission();
    result.name = data.name;
    return result;
  }
}
