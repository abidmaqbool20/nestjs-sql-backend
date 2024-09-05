import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, ArrayNotEmpty, IsNumberString } from 'class-validator';


export class UpdateDto extends PartialType(CreateDto) {

  @ApiProperty({ description: 'The name of the role', required: true })
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Array of permission IDs associated with the role', example: ['1', '2'], required: false })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  permissions?: string[];
}
