import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBlogDto {
  @MinLength(10, { message: 'Title is too short!' })
  @MaxLength(80, { message: 'Title is too long!' })
  @IsString({ message: 'Title must be string' })
  readonly title: string;

  @MinLength(15, { message: 'Text is too short!' })
  @IsString({ message: 'Title must be string' })
  readonly text: string;

  @IsNotEmpty()
  readonly userId: string;

  readonly tags?: any;

  // @IsOptional()
  // id: number;

  // @IsNotEmpty()
  // title: string;

  // @IsNotEmpty()
  // description: string;

  // @IsNotEmpty({ message: 'content is not empty' })
  // content: string;

  // @IsOptional()
  // tag: string;

  // @IsNotEmpty()
  // readonly userId: number;

  // readonly tags?: any;
}
