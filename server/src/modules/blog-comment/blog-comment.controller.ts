import { AuthUser } from './../../decorator/auth.user.decorator';
import { Controller, UseGuards, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlogCommentService } from './blog-comment.service';
import { AuthUserDto } from 'src/base/base.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { EntityId } from 'typeorm/repository/EntityId';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('v1/blog-comment')
@Controller('v1/blog-comment')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Get(':id/comment')
  async findAllBlogComment(@Param('id') id: EntityId) {
    return this.blogCommentService.findAllCommentId(id);
  }

  @Get(':id/user')
  async testABC(@AuthUser() authUser: AuthUserDto, @Param('id') id: EntityId) {
    return this.blogCommentService.findAllCommentByUser(authUser, id);
  }

  @Get(':id')
  async findBlogComment(@Param('id') id: EntityId) {
    return this.blogCommentService.findCommentId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async createComment(@AuthUser() authUser: AuthUserDto, @Body() createCommentDto: CreateCommentDto) {
    // return this.blogCommentService.createComment(authUser, createCommentDto, id);
    return this.blogCommentService.createComment(authUser, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@AuthUser() authUser: AuthUserDto, @Param('id') id: EntityId) {
    return this.blogCommentService.deleteComment(authUser, id);
  }
}
