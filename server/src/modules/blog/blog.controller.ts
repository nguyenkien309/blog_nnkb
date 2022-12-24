import { EntityId } from 'typeorm/repository/EntityId';
import { plainToClass } from 'class-transformer';
import { BlogEntity } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { AuthUserDto, BaseResponseDto, PaginationQueryDto } from './../../base/base.dto';
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
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  BadGatewayException,
} from '@nestjs/common';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { DeleteResult } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { ErrorCode } from '@src/constant/errorCode.enum';

@ApiTags('v1/blog')
@Controller('v1/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('')
  async create(
    @AuthUser() authUser: AuthUserDto,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BaseResponseDto<BlogEntity>> {
    const blog = await this.blogService.createBlog(authUser, createBlogDto);
    return new BaseResponseDto<BlogEntity>(blog);
  }

  @Get(':id/user-blog')
  async listBlogUser(@Param('id') id: number, @AuthUser() authUser: AuthUserDto) {
    return this.blogService.getBlogUser(id, authUser);
  }

  @Get('/blogTag/:tagId')
  getPostsByTagId(@Param('tagId', new ParseIntPipe()) tagId: number) {
    return this.blogService.getPostsByTagId(tagId);
  }

  @Get('blogs-lastest')
  async listBlogsPaginateTest(@Query() query: PaginationQueryDto) {
    return this.blogService.getBlogsPaginate(query);
  }

  @Get('blogs-hot')
  async listHotBlogs(@Query() query: PaginationQueryDto) {
    return this.blogService.getHotBlogs(query);
  }

  @Get('blogs-Top')
  async listTopBlogs(@Query() query: PaginationQueryDto) {
    return this.blogService.getTopBlogs(query);
  }

  @Get(':id')
  async findBlog(@Param('id') id: number) {
    return await this.blogService.getBlogById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editBlog(
    @Param('id') blogId: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BaseResponseDto<BlogEntity>> {
    const blog = await this.blogService.editBlog(blogId, updateBlogDto);
    return new BaseResponseDto<BlogEntity>(plainToClass(BlogEntity, blog));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async destroy(@Param('id') id: number, @AuthUser() authUser: AuthUserDto): Promise<BaseResponseDto<DeleteResult>> {
    const blog = await this.blogService.findBlogById(id);
    if (blog.userId !== authUser.payload.id || blog.userId !== authUser.id) {
      throw new BadGatewayException(ErrorCode.PERMISSION_DENIED);
    }
    await this.blogService.delete(id);
    return new BaseResponseDto<DeleteResult>(null);
  }
}
