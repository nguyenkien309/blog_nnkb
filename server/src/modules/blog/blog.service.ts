import { BlogCommentEntity } from './../blog-comment/entities/blog-comment.entity';
import { AuthUserDto } from './../../base/base.dto';
import { TagService } from './../tag/tag.service';
import { TagEntity } from './../tag/entities/tag.entity';
import { BlogLikeEntity } from './../blog-like/entities/blog-like.entity';
import { CreateBlogLikeDto } from './../blog-like/dto/create-blog-like.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { EntityId } from 'typeorm/repository/EntityId';
import { UploadService } from './../upload-file/upload-file.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { LoggerService } from '../../logger/custom.logger';
import { Repository, Entity, DeleteResult } from 'typeorm';
import { BlogRepository } from './blog.repository';
import { BaseService } from './../../base/base.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { PaginationQueryDto } from '@base/base.dto';
import { async } from 'rxjs';

@Injectable()
export class BlogService extends BaseService<BlogEntity, BlogRepository> {
  delete(id: EntityId) {
    return this.repository.manager.transaction(async (manager) => {
      const blog = await manager.findOneBy(BlogEntity, { id: <number>id });
      blog.tags = [];
      blog.save();
      await manager.delete(BlogLikeEntity, { blogId: id });
      await manager.delete(BlogCommentEntity, { blogId: id });
      await manager.delete(BlogEntity, { id: id });
    });
  }
  constructor(
    repository: BlogRepository,
    logger: LoggerService,
    private readonly uploadService: UploadService, // private readonly tagService: TagService,
  ) {
    super(repository, logger);
  }

  async getBlogsPaginate(userId, query: PaginationQueryDto) {
    const { limit = 20, page = 0, keyword, id, sort } = query;

    const qb = this.repository.createQueryBuilder('blogs');

    if (id) {
      console.log(id);

      qb.andWhere('blogs.id = :id', { id: id });
    }
    // if (keyword) {
    //   qb.andWhere('blogs.title LIKE :title', { title: `%${keyword}%` });
    //   qb.andWhere('blogs.content LIKE :content', { content: `%${keyword}%` });
    // }
    qb.andWhere('blogs.deleted = false');
    // qb.andWhere('blogs.status = :status', { status: BlogStatus.APPROVE });
    qb.skip(limit * page)
      .take(limit)
      .orderBy(sort?.by, sort?.direction)
      .orderBy('blogs.numLike', 'DESC')
      .orderBy('blogs.numSeen', 'DESC');

    const [blogs, total] = await qb.getManyAndCount();
    console.log(qb.getQuery());
    console.log(total);
    return blogs;
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

  async getBlogUser(id, user) {
    // console.log(user);
    // return user;
    return this.repository.find({
      where: { userId: id },
    });
  }
  // async getBlogByIdRlt(id) {
  //   return this.repository.findOne({
  //     relations: ['comments', 'blog-like'],
  //   });
  // }

  async createBlog(authUserDto: AuthUserDto, createBlogDto: CreateBlogDto, file): Promise<BlogEntity | undefined> {
    const createBlog = new BlogEntity(createBlogDto);
    createBlog.userId = authUserDto.payload.id;
    if (file) {
      const filepath = await this.uploadService.createFile(file);
      createBlog.blogImage = filepath;
    }
    if (createBlog.tags) {
      const tagsArray = createBlogDto.tags.map((tag) => new TagEntity(tag));
      createBlog.tags = tagsArray as TagEntity[];
    }

    await this.repository.save(createBlog);
    return this.findBlogById(createBlog.id);
  }

  async editBlog2(id, updateBlogDto: UpdateBlogDto, file) {
    updateBlogDto.blogId = id;
    let { blogImage } = updateBlogDto;
    const post = await this._findById(id);
    let arrayTag;
    if (file) {
      const filepath = await this.uploadService.createFile(file);
      blogImage = filepath;
      if (updateBlogDto.tags) {
        arrayTag = updateBlogDto.tags.map((tag) => new TagEntity(tag));
        // console.log('updateBlogDto.tags', updateBlogDto.tags);
        console.log('tagsArray', arrayTag);
      }
    }
    post.blogImage = blogImage;
    console.log('blogImage', blogImage);

    post.tags = arrayTag ? arrayTag : updateBlogDto.tags;
    await this.repository.save(post);
    return post;
  }

  async deleteBlog(blogId: EntityId): Promise<DeleteResult | undefined> {
    return this._delete(blogId);
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
