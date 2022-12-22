import { AuthUser } from './../../decorator/auth.user.decorator';
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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlogCommentService } from './blog-comment.service';
import { AuthUserDto, BaseResponseDto } from 'src/base/base.dto';
import { BlogCommentEntity } from './entities/blog-comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EntityId } from 'typeorm/repository/EntityId';

@Controller('v1/blog-comment')
@UseGuards(JwtAuthGuard)
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

  @Post(':id')
  async createComment(
    @AuthUser() authUser: AuthUserDto,
    @Body() createCommentDto: CreateCommentDto,
    @Param('id') id: EntityId,
  ) {
    // return this.blogCommentService.createComment(authUser, createCommentDto, id);
    return this.blogCommentService.createComment(createCommentDto);
  }

  @Post(':id/update')
  async updateComment(
    @AuthUser() authUser: AuthUserDto,
    @Body() updateCommentDto: UpdateCommentDto,
    @Param('id') id: EntityId,
  ) {
    return this.blogCommentService.updateComment(authUser, updateCommentDto, id);
  }

  @Delete(':id')
  async deleteComment(@AuthUser() authUser: AuthUserDto, @Param('id') id: EntityId) {
    return this.blogCommentService.deleteComment(authUser, id);
  }
}
