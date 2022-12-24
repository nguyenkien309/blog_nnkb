import { TagEntity } from './../../tag/entities/tag.entity';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty()
  // @IsString({ message: 'Title must be string' })
  readonly title: string;

  @ApiProperty()
  @IsString({ message: 'Title must be string' })
  readonly content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  readonly userId: string;

  @ApiProperty()
  @IsOptional()
  blogImage: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  tags?: TagEntity[];
}
