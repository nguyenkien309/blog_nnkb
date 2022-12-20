import { BlogsModule } from './../blog/blog.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCommentController } from './blog-comment.controller';
import { BlogCommentRepository } from './blog-comment.repository';
import { BlogCommentService } from './blog-comment.service';
import { BlogCommentEntity } from './entities/blog-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCommentEntity]), BlogsModule],
  controllers: [BlogCommentController],
  providers: [BlogCommentService, BlogCommentRepository],
})
export class BlogCommentModule {}
