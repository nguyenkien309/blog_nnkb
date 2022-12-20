import { EntityId } from 'typeorm/repository/EntityId';
import { BlogEntity } from './../blog/entities/blog.entity';
import { DeleteResult } from 'typeorm';
import { BlogService } from './../blog/blog.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { LoggerService } from '../logger/custom.logger';
import { BlogLikeRepository } from './blog-like.repository';
import { BlogLikeEntity } from './entities/blog-like.entity';
import { CreateBlogLikeDto } from './dto/create-blog-like.dto';

@Injectable()
export class BlogLikeService extends BaseService<BlogLikeEntity, BlogLikeRepository> {
  constructor(repository: BlogLikeRepository, logger: LoggerService, private readonly blogService: BlogService) {
    super(repository, logger);
  }

  async like(createBlogLikeDto: CreateBlogLikeDto) {
    const exist = await this.blogService._findById(createBlogLikeDto.blogId);
    console.log(exist);
    if (exist) {
      const blogLike = await this.checkLike(createBlogLikeDto);
      if (blogLike instanceof BlogLikeEntity) {
        this.updatenumLike(createBlogLikeDto.blogId, true);
        return { like: true };
      } else if (blogLike instanceof DeleteResult) {
        this.updatenumLike(createBlogLikeDto.blogId, false);
        return { like: false };
      }
    } else {
      throw new HttpException(`Not Found BlogId: ${createBlogLikeDto.blogId}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserLikeBlog(createBlogLikeDto: CreateBlogLikeDto) {
    const exist = await this.repository.findOne({
      where: { userId: createBlogLikeDto.userId, blogId: createBlogLikeDto.blogId },
    });
    if (exist) {
      return true;
    } else {
      return false;
    }
  }

  async likeTest(createBlogLikeDto: CreateBlogLikeDto) {
    // const exist = await this.blogService._findById(createBlogLikeDto.blogId);
    // const like = new BlogLikeEntity(createBlogLikeDto);
    // like.blogId = createBlogLikeDto.blogId;
    // like.userId = createBlogLikeDto.userId;
    // const newLike = await this._store(like);
    // return newLike;
    // return await this._findById(newLike.blogId);
    // return await this.likeRepository.findOne(newLike.id, { relations: ['post'] });
    // if (exist) {
    //   const blogLike = await this.checkLike(createBlogLikeDto);
    //   if (blogLike instanceof BlogLikeEntity) {
    //     this.updatenumLike(createBlogLikeDto.blogId, true);
    //     return { like: true };
    //   } else if (blogLike instanceof DeleteResult) {
    //     this.updatenumLike(createBlogLikeDto.blogId, false);
    //     return { like: false };
    //   }
    // } else {
    //   throw new HttpException(`Not Found BlogId: ${createBlogLikeDto.blogId}`, HttpStatus.BAD_REQUEST);
    // }
    // return newLike;
  }
  async checkLike(createBlogLikeDto: CreateBlogLikeDto): Promise<BlogLikeEntity | DeleteResult> {
    const createBlogLike = new BlogLikeEntity(createBlogLikeDto);
    const exist = await this.repository.findOne({
      where: { blogId: createBlogLike.blogId, userId: createBlogLike.userId },
    });
    if (exist) {
      return this.repository.delete({
        blogId: createBlogLike.blogId,
        userId: createBlogLike.userId,
      });
    } else {
      const blogLike = this._store(createBlogLike);
      return blogLike;
    }
  }

  async updatenumLike(id: EntityId, isAdd = true): Promise<BlogEntity> {
    const exist = await this.blogService._findById(id);
    if (exist) {
      return await this.blogService._update(id, {
        numLike: exist.numLike + (isAdd ? +1 : -1),
      });
    }
    return exist;
  }
}
