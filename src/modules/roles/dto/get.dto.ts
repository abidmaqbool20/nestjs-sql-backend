import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetDto {

  @ApiProperty({ description: 'The ID of the role' })
  @IsNotEmpty()
  id: bigint;
}
