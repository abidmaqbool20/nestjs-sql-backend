import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class DeleteDto {
  @ApiProperty({ description: 'The ID of the permission' })
  @IsNotEmpty()
  id: bigint;
}