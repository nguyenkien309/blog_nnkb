import { TagEntity } from './../../tag/entities/tag.entity';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBlogDto {
  // @MinLength(10, { message: 'Title is too short!' })
  // @MaxLength(80, { message: 'Title is too long!' })
  @IsString({ message: 'Title must be string' })
  readonly title: string;

  // @MinLength(15, { message: 'Text is too short!' })
  @IsString({ message: 'Title must be string' })
  readonly content: string;

  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  tags?: TagEntity[];
}
