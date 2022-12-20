import { UpdateBlogDto } from './../blog/dto/update-blog.dto';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { LoggerService } from '../logger/custom.logger';
import { BlogCommentRepository } from './blog-comment.repository';
import { BlogCommentEntity } from './entities/blog-comment.entity';
import { Repository, Entity, DeleteResult } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class BlogCommentService extends BaseService<BlogCommentEntity, BlogCommentRepository> {
  constructor(repository: BlogCommentRepository, logger: LoggerService, private readonly blogService: BlogService) {
    super(repository, logger);
  }

  // async createComment(userId, createCommentDto: CreateCommentDto, id): Promise<BlogCommentEntity> {
  async createComment(createCommentDto: CreateCommentDto): Promise<BlogCommentEntity> {
    const createComment = new BlogCommentEntity(createCommentDto);
    createComment.userId = createCommentDto.userId;
    createComment.blogId = createCommentDto.blogId;
    // createComment.blogId = createCommentDto.blogId;
    // createComment.userId = userId.payload.id;
    // createComment.blogId = id;
    // console.log('createComment.userId', createComment.userId, 'userId.payload.id', userId.payload.id);

    const comment = await this._store(createComment);
    if (comment) {
      await this.blogService.updatenumComment(createComment.blogId, true);
    }
    return comment;
  }

  async updateComment(userId, updateCommentDto, id) {
    const updateUser = new BlogCommentEntity(updateCommentDto);
    // const exist = this.repository.find({
    //   where: { id: id, userId: userId.payload.id },
    // });
    return this._update(id, updateUser);
  }

  async deleteComment(userId, id) {
    const exist = await this._findById(id);

    if (exist) {
      this.blogService.updatenumComment(exist.blogId, false);
    }
    return this.delete(id);
  }

  async findCommentId(id) {
    return this._findById(id);
  }

  async findAllCommentId(id) {
    return this.repository.find({
      where: { blogId: id },
    });
  }
}
