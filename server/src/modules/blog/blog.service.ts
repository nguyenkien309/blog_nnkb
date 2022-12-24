import { BlogCommentEntity } from './../blog-comment/entities/blog-comment.entity';
import { AuthUserDto } from './../../base/base.dto';
import { TagEntity } from './../tag/entities/tag.entity';
import { BlogLikeEntity } from './../blog-like/entities/blog-like.entity';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { EntityId } from 'typeorm/repository/EntityId';
import { UploadService } from './../upload-file/upload-file.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { LoggerService } from '../../logger/custom.logger';
import { DeleteResult } from 'typeorm';
import { BlogRepository } from './blog.repository';
import { BaseService } from './../../base/base.service';
import { Injectable } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { PaginationQueryDto } from '@base/base.dto';

@Injectable()
export class BlogService extends BaseService<BlogEntity, BlogRepository> {
  constructor(
    repository: BlogRepository,
    logger: LoggerService,
    private readonly uploadService: UploadService, // private readonly tagService: TagService,
  ) {
    super(repository, logger);
  }

  async getBlogsPaginate(query: PaginationQueryDto) {
    const limit = query.limit ? query.limit : 4;
    const page = query.page ? query.page : 0;
    // let sort = query.sort ? query.sort : 'DESC';
    // let filter = query.filter ? query.filter : ;
    const qb = this.repository.createQueryBuilder('blogs');
    qb.leftJoinAndSelect('blogs.user', 'u');
    qb.leftJoinAndSelect('blogs.tags', 't');
    // if (id) {
    //   qb.andWhere('blogs.id = :id', { id: id });
    // }
    // if (keyword) {
    //   qb.andWhere('blogs.title LIKE :title', { title: `%${keyword}%` });
    //   qb.andWhere('blogs.content LIKE :content', { content: `%${keyword}%` });
    // }
    qb.andWhere('blogs.deleted = false');
    // qb.andWhere('blogs.status = :status', { status: BlogStatus.APPROVE });
    qb.skip(limit * page)
      .take(limit)
      // .orderBy(sort?.by, sort?.direction)
      .orderBy('blogs.updatedAt', 'DESC');
    // .orderBy('blogs.numSeen', 'DESC');

    const [blogs, total] = await qb.getManyAndCount();
    console.log(qb.getQuery());
    console.log('total', total);
    return blogs;
  }

  async getLastestBlogs() {
    return this._findByDeleted(false, false, 0);
  }

  async getHotBlogs(query: PaginationQueryDto) {
    const limit = query.limit ? query.limit : 4;
    const page = query.page ? query.page : 0;
    // let sort = query.sort ? query.sort : 'DESC';
    // let filter = query.filter ? query.filter : ;
    const qb = this.repository.createQueryBuilder('blogs');
    // qb.leftJoinAndSelect('blogs.media', 'm')
    qb.leftJoinAndSelect('blogs.user', 'u');
    qb.leftJoinAndSelect('blogs.tags', 't');
    // if (id) {
    //   qb.andWhere('blogs.id = :id', { id: id });
    // }
    // if (keyword) {
    //   qb.andWhere('blogs.title LIKE :title', { title: `%${keyword}%` });
    //   qb.andWhere('blogs.content LIKE :content', { content: `%${keyword}%` });
    // }
    qb.andWhere('blogs.deleted = false');
    // qb.andWhere('blogs.status = :status', { status: BlogStatus.APPROVE });
    qb.skip(limit * page)
      .take(limit)
      // .orderBy(sort?.by, sort?.direction)
      .orderBy('blogs.numLike', 'ASC');
    // .orderBy('blogs.numLike', 'DESC')
    // .orderBy('blogs.numSeen', 'DESC');

    const [blogs, total] = await qb.getManyAndCount();
    console.log(qb.getQuery());
    console.log('total', total);
    return blogs;
  }

  async getTopBlogs(query: PaginationQueryDto) {
    const limit = query.limit ? query.limit : 4;
    const page = query.page ? query.page : 0;
    // let sort = query.sort ? query.sort : 'DESC';
    // let filter = query.filter ? query.filter : ;
    const qb = this.repository.createQueryBuilder('blogs');
    qb.leftJoinAndSelect('blogs.user', 'u');
    qb.leftJoinAndSelect('blogs.tags', 't');
    qb.andWhere('blogs.deleted = false');
    qb.skip(limit * page)
      .take(limit)
      // .orderBy(sort?.by, sort?.direction)
      .orderBy('blogs.numLike', 'DESC')
      .orderBy('blogs.numComment', 'DESC')
      .orderBy('blogs.numSeen', 'DESC');

    const [blogs, total] = await qb.getManyAndCount();
    console.log(qb.getQuery());
    console.log('total', total);
    return blogs;
  }

  async getBlogById(id) {
    return this.repository.findOne({
      where: { id: id },
      relations: ['comments', 'userLikes'],
    });
  }

  async getBlogUser(id, user) {
    return this.repository.find({
      where: { userId: id },
    });
  }

  async createBlog(authUserDto: AuthUserDto, createBlogDto: CreateBlogDto): Promise<BlogEntity | undefined> {
    const createBlog = new BlogEntity(createBlogDto);
    createBlog.userId = authUserDto.payload.id;
    if (createBlog.tags) {
      const tagsArray = createBlogDto.tags.map((tag) => new TagEntity(tag));
      createBlog.tags = tagsArray as TagEntity[];
    }
    await this.repository.save(createBlog);
    return this.findBlogById(createBlog.id);
  }

  async editBlog(id, updateBlogDto: UpdateBlogDto) {
    updateBlogDto.blogId = id;
    const { blogImage } = updateBlogDto;
    const post = await this._findById(id);
    if (updateBlogDto.blogImage) {
      post.blogImage = blogImage;
    }
    if (updateBlogDto.tags) {
      const tagsArray = updateBlogDto.tags.map((tag) => new TagEntity(tag));
      post.tags = tagsArray as TagEntity[];
    }
    post.tags = updateBlogDto.tags;
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

  async findBlogById(id: number) {
    return this._findById(id);
  }

  async getPostsByTagId(tagId: number) {
    const posts = await this.repository.find();
    return posts.filter((post) => post.tags.some((tag) => tag.id === tagId));
  }

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
}
