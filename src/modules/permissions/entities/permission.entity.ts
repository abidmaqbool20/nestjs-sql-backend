import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateDto } from '../dto/create.dto';
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ unique: true })
  name: string;



  static async newInstanceFromDTO(data: CreateDto): Promise<Permission> {
    const result = new Permission();
    result.name = data.name;
    return result;
  }
}
