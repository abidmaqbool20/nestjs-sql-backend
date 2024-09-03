import { IsOptional, IsString, IsEmail, IsDate } from 'class-validator';

export class RegisterUserDto { 

  @IsOptional()
  @IsString()
  name: string;

  @IsEmail()
  email: string;
 
  @IsString()
  password: string;

  @IsOptional()
  @IsDate()
  created_at: Date;

  @IsOptional()
  @IsDate()
  updated_at: Date;
}
