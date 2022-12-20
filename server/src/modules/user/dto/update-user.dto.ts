import { UniqueEmailValidator } from './../../../validator/unique-email.validator';
import { IsBoolean, IsNotEmpty, IsOptional, Length, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  // @ApiProperty()
  // @IsOptional()
  // id: number;

  // @ApiProperty()
  // @IsOptional()
  // name: string;

  // @IsNotEmpty()
  // @IsOptional()
  // email: string;

  // @ApiProperty()
  // @IsOptional()
  // avatar: string;
  /////

  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;
}
