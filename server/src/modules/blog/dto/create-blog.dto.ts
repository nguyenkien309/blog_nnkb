import { TagEntity } from './../../tag/entities/tag.entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty()
  @IsString({ message: 'Title must be string' })
  readonly title: string;

  @ApiProperty()
  @IsString({ message: 'Title must be string' })
  readonly content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  readonly userId: number;

  @ApiProperty()
  @IsOptional()
  blogImage: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  tags?: TagEntity[];
}
