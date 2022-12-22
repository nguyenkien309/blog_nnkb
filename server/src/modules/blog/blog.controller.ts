import { BlogLikeService } from './../blog-like/blog-like.service';
import { BlogLikeEntity } from './../blog-like/entities/blog-like.entity';
import { CreateBlogLikeDto } from './../blog-like/dto/create-blog-like.dto';
import { EntityId } from 'typeorm/repository/EntityId';
import { plainToClass, plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogEntity } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { AuthUserDto, BaseResponseDto } from './../../base/base.dto';
import { AuthUser } from './../../decorator/auth.user.decorator';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { DeleteResult } from 'typeorm';

@Controller('v1/blog')
@UseGuards(JwtAuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @Post('')
  async create(
    @AuthUser() authUser: AuthUserDto,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponseDto<BlogEntity>> {
    const blog = await this.blogService.createBlog(authUser, createBlogDto, file);
    return new BaseResponseDto<BlogEntity>(blog);
  }

  @Get('/blog-paginate')
  async listBlogsPaginate() {
    return this.blogService.getBlogsPaginate();
  }

  // @Get('/blogTag')
  // async listTest() {
  //   return this.blogService.listTest();
  // }

  @Get('/blogTag/:tagId')
  getPostsByTagId(@Param('tagId', new ParseIntPipe()) tagId: number) {
    return this.blogService.getPostsByTagId(tagId);
  }

  @Get('blogs-lastest')
  async listLastestBlogs() {
    return this.blogService.getLastestBlogs();
  }

  @Get('blogs-hot')
  async listHotBlogs() {
    return this.blogService.getHotBlogs();
  }

  @Get('blogs-Top')
  async listTopBlogs() {
    return this.blogService.getTopBlogs();
  }

  @Get(':id')
  async findBlog(@Param('id') id: EntityId) {
    return await this.blogService.getBlogById(id);
  }

  // @Get(':id/blog')
  // async findBlog(@Param('id') id: EntityId): Promise<BaseResponseDto<BlogEntity>> {
  //   const blog = await this.blogService.getBlogById(id);
  //   return new BaseResponseDto<BlogEntity>(plainToClass(BlogEntity, blog));
  // }

  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async editBlog(
    @Param('id') blogId: EntityId,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponseDto<BlogEntity>> {
    const blog = await this.blogService.editBlog(blogId, updateBlogDto, file);
    return new BaseResponseDto<BlogEntity>(plainToClass(BlogEntity, blog));
  }

  @Delete(':id')
  async destroy(@Param('id') id: EntityId): Promise<BaseResponseDto<DeleteResult>> {
    await this.blogService.delete(id);
    return new BaseResponseDto<DeleteResult>(null);
  }
}