// create-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export class CreateDto {
  @ApiProperty({ description: 'The name of the role', example: 'Admin' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Array of permission IDs associated with the role', example: ['1', '2'], required: false })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  permissions: string[];
}
