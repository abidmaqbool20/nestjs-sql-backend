import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsDate } from 'class-validator';

export class UpdateDto extends PartialType(CreateDto) {

  @ApiProperty({ description: 'The name of the permission', required: true })
  @IsString()
  name?: string;
}
