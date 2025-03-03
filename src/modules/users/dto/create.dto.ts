import { IsOptional, IsString, IsEmail, IsDate, IsArray, IsInt} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Role} from '../../roles/entities/role.entity'
import { Type } from 'class-transformer';
export class CreateDto {

  @ApiProperty({ description: 'The name of the user' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  password: string;

  @IsOptional()
  @IsDate()
  created_at: Date;

  @IsOptional()
  @IsDate()
  updated_at: Date;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  roleIds?: number[];
}
