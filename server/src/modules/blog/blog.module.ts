import { TagRepository } from './../tag/tag.repository';
import { TagModule } from './../tag/tag.module';
import { TagService } from './../tag/tag.service';
import { UploadService } from './../upload-file/upload-file.service';
import { BlogEntity } from './entities/blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogRepository } from './blog.repository';
import { BlogLikeService } from '../blog-like/blog-like.service';

@Module({
  controllers: [BlogController],
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  providers: [BlogService, BlogRepository, UploadService],
  exports: [TypeOrmModule, BlogService],
})
export class BlogsModule {}
