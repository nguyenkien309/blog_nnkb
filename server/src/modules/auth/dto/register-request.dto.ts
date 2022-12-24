import { UniqueEmailValidator } from './../../../validator/unique-email.validator';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Validate } from 'class-validator';

export class RegisterRequestDto {
  @IsOptional()
  @IsNotEmpty({ message: 'name is not empty' })
  name: string;

  @IsNotEmpty({ message: 'email is not empty' })
  @IsEmail(undefined, { message: 'email invalid' })
  @Validate(UniqueEmailValidator)
  email: string;

  @IsNotEmpty({ message: 'password is not empty' })
  @Length(8, 24, { message: 'password invalid' })
  password: string;

  @IsNotEmpty({ message: 'password confirmation is not empty' })
  passwordConfirmation: string;
}
