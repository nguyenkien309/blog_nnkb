import { BlogLikeService } from './blog-like.service';
import { AuthUser } from './../../decorator/auth.user.decorator';
import { AuthUserDto, BaseResponseDto } from './../../base/base.dto';
import { EntityId } from 'typeorm/repository/EntityId';
import { PAGE_SIZE } from './../../config/config';
import { Controller, UseGuards, Post, Body, Param, BadGatewayException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBlogLikeDto } from './dto/create-blog-like.dto';
import { UserService } from '../user/user.service';
import { ErrorCode } from '@src/constant/errorCode.enum';

@Controller('/v1/blog-like')
@UseGuards(JwtAuthGuard)
export class BlogLikeController {
  constructor(private readonly blogLikeService: BlogLikeService, private readonly userService: UserService) {}

  @Post(':id/like')
  async likeBlog(
    @Param('id') blogId: EntityId,
    @AuthUser() authUser: AuthUserDto,
    @Body() createBlogLikeDto: CreateBlogLikeDto,
  ) {
    const user = await this.userService._findById(authUser.id);
    if (!user) {
      throw new BadGatewayException(ErrorCode.USER_NOT_FOUND);
    }
    createBlogLikeDto.userId = authUser.id;
    return this.blogLikeService.like(createBlogLikeDto);
  }

  @Post(':id')
  async getUserLike(@Param('id') blogId: number, @Body() createBlogLikeDto: CreateBlogLikeDto) {
    createBlogLikeDto.blogId = blogId;
    return this.blogLikeService.getUserLikeBlog(createBlogLikeDto);
  }
}
