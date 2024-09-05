import { IsOptional, IsString  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDto {

  @ApiProperty({ description: 'The name of the Permission' })
  @IsString()
  name: string;
}
