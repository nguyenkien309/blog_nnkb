import { UpdateUserDto } from './../dto/update-user.dto';
import { AuthUser } from './../../../decorator/auth.user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './../../auth/guards/jwt-auth.guard';
import { BaseResponseDto, AuthUserDto } from './../../../base/base.dto';
import { UserService } from 'src/modules/user/user.service';
import { Body, Controller, Get, HttpCode, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserEntity } from '../entities/user.entity';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/test')
  async test(): Promise<BaseResponseDto<any>> {
    const data = await this.userService.test();
    return new BaseResponseDto<any>(plainToInstance(UserEntity, data));
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('/update-profile')
  // async myProfile(
  //   @AuthUser() authUser: AuthUserDto,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<BaseResponseDto<UserEntity>> {
  //   const user = await this.userService.updateProfile(authUser.id, updateUserDto);
  //   return new BaseResponseDto<UserEntity>(plainToClass(UserEntity, user));
  // }
}
