import { TagService } from './../tag/tag.service';
import { TagEntity } from './../tag/entities/tag.entity';
import { BlogLikeEntity } from './../blog-like/entities/blog-like.entity';
import { CreateBlogLikeDto } from './../blog-like/dto/create-blog-like.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { EntityId } from 'typeorm/repository/EntityId';
import { UploadService } from './../upload-file/upload-file.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { LoggerService } from './../logger/custom.logger';
import { Repository, Entity, DeleteResult } from 'typeorm';
import { BlogRepository } from './blog.repository';
import { BaseService } from './../../base/base.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';

@Injectable()
export class BlogService extends BaseService<BlogEntity, BlogRepository> {
  constructor(
    repository: BlogRepository,
    logger: LoggerService,
    private readonly uploadService: UploadService, // private readonly tagService: TagService,
  ) {
    super(repository, logger);
  }

  async getBlogsPaginate() {
    return;
  }

  async listTest() {
    return 'ditme';
  }

  async getLastestBlogs() {
    return this._findByDeleted(false, false, 0);
  }

  async getHotBlogs() {
    return await this.repository.find({
      where: { deleted: false },
      order: { numLike: 'DESC', numComment: 'DESC' },
    });
  }

  async getTopBlogs() {
    return await this.repository.find({
      where: { deleted: false },
      order: { numComment: 'DESC' },
    });
  }

  async getBlogById(id) {
    // return this._findById(id,{
    //   relations: ['comments', 'blog-like'],
    // }));

    return this.repository.findOne({
      where: { id: id },
      relations: ['comments', 'userLikes'],
    });

    // return await this.repository.find({
    //   where: { deleted: false },
    //   order: { numLike: 'DESC', numComment: 'DESC' },
    // });

    // const post = await this.repository.find(id, {
    //   relations: ['comments', 'userLikes'],
    // });
  }

  // async getBlogByIdRlt(id) {
  //   return this.repository.findOne({
  //     relations: ['comments', 'blog-like'],
  //   });
  // }

  async createBlog(userId, createBlogDto: CreateBlogDto, file): Promise<BlogEntity | undefined> {
    const createBlog = new BlogEntity(createBlogDto);
    createBlog.userId = userId.payload.id;
    if (file) {
      const filepath = await this.uploadService.createFile(file);
      createBlog.blogImage = filepath;
    }
    if (createBlog.tags) {
      const tagsArray = createBlogDto.tags.map((tag) => JSON.parse(JSON.stringify(tag)));
      const arrayTag = tagsArray.map((tag) => JSON.parse(tag));
      createBlog.tags = arrayTag as TagEntity[];
    }
    console.log('createBlog.tags', createBlog.tags);

    await this.repository.save(createBlog);
    // const blog = await this._store(createBlog);
    // if (createBlog.tags) {
    // const createTag = new TagEntity(createBlogDto);
    // createTag.blogId = blog.id;
    // createTag.name = 'test';
    // await this.tagService._store(createTag);
    // console.log('createBlog.id', blog.id, createTag.name);
    // }
    return this.findBlogById(createBlog.id);
    // return await this._findById(blog.id);
    // return;
  }

  async editBlog(blogId: EntityId, updateBlogDto: UpdateBlogDto, file): Promise<BlogEntity | undefined> {
    // const blog = await this._findById(blogId);
    // const updateBlog = new BlogEntity(updateBlogDto);
    // if (!blog) {
    //   throw new HttpException(`Not Found Blog : ${blogId}`, HttpStatus.BAD_REQUEST);
    // }
    // if (file) {
    //   const filepath = await this.uploadService.createFile(file);
    //   updateBlog.blogImage = filepath;
    // }
    // return this._update(blogId, updateBlog);
    return;
  }

  async deleteBlog(blogId: EntityId): Promise<DeleteResult | undefined> {
    return this.delete(blogId);
  }

  async updatenumLike(id: EntityId, isAdd = true): Promise<BlogEntity> {
    const existBlog = this._findById(id);
    if (existBlog) {
      return await this._update(id, { numLike: (await existBlog).numLike + (isAdd ? +1 : -1) });
    }
    return;
  }

  async updatenumComment(id: EntityId, isAdd = true): Promise<BlogEntity> {
    const exist = await this._findById(id);
    if (exist) {
      return await this._update(id, {
        numComment: exist.numComment + (isAdd ? +1 : -1),
      });
    }
    return exist;
  }

  async findBlogById(id) {
    return this._findById(id);
  }

  async getPostsByTagId(tagId: number) {
    const posts = await this.repository.find();
    return posts.filter((post) => post.tags.some((tag) => tag.id === tagId));
  }
}
