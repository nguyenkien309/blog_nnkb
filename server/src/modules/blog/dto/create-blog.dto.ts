import { TagEntity } from './../../tag/entities/tag.entity';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBlogDto {
  @IsString({ message: 'Title must be string' })
  readonly title: string;

  @IsString({ message: 'Title must be string' })
  readonly content: string;

  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  @IsOptional()
  tags?: TagEntity[];
}
