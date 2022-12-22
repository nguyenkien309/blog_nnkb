import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { TagEntity } from '@src/modules/tag/entities/tag.entity';

// export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
export class UpdateBlogDto {
  // @IsString({ message: 'Title must be string' })
  // title: string;

  // @IsString({ message: 'Title must be string' })
  // content: string;

  @ApiProperty()
  @IsOptional()
  blogId: number;

  @ApiProperty()
  @IsOptional()
  blogImage: string;

  @ApiProperty()
  @IsOptional()
  tags?: TagEntity[];
}
