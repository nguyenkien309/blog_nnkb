import { UserModule } from './../user/user.module';
import { BlogsModule } from './../blog/blog.module';
import { BlogLikeService } from './blog-like.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogLikeEntity } from './entities/blog-like.entity';
import { Module } from '@nestjs/common';
import { BlogLikeController } from './blog-like.controller';
import { BlogLikeRepository } from './blog-like.repository';

@Module({
  controllers: [BlogLikeController],
  imports: [TypeOrmModule.forFeature([BlogLikeEntity]), BlogsModule, UserModule],
  providers: [BlogLikeService, BlogLikeRepository],
  exports: [TypeOrmModule],
})
export class BlogLikeModule {}
