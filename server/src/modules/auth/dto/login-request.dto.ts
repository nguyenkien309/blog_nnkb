import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ example: 'nvk309@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  password: string;
}
