import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { plainToInstance, plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import { UserEntity } from './../user/entities/user.entity';
import { BaseResponseDto, AuthUserDto } from './../../base/base.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login-request.dto';
import { AuthUser } from 'src/decorator/auth.user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('v1/auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() request: LoginRequestDto): Promise<BaseResponseDto<any>> {
    const data = await this.authService.login(request);
    return new BaseResponseDto<any>(plainToInstance(UserEntity, data));
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logOutUser(@AuthUser() authUser: AuthUserDto) {
    const user = await this.userService._findById(authUser.id);
    return this.authService.logout(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/register')
  async register(@Body() registerRequestDto: RegisterRequestDto): Promise<BaseResponseDto<UserEntity>> {
    const user = await this.userService._store(registerRequestDto);

    return new BaseResponseDto<UserEntity>(plainToClass(UserEntity, user));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async myProfile(@AuthUser() authUser: AuthUserDto): Promise<BaseResponseDto<UserEntity>> {
    const user = await this.userService._findById(authUser.id);
    return new BaseResponseDto<UserEntity>(plainToClass(UserEntity, user));
  }

  @Post('refresh')
  async refresh(@Body() body) {
    return await this.authService.refresh(body.refresh_token);
  }

  // @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(JwtAuthGuard)
  // @Post('/update-profile')
  // async updateUser(
  //   @AuthUser() authUser: AuthUserDto,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<BaseResponseDto<UserEntity>> {
  //   const findUser = await this.userService._findById(authUser.id);
  //   const updateUser = await this.userService.updateUser(findUser.id, updateUserDto, file);
  //   return new BaseResponseDto<UserEntity>(plainToClass(UserEntity, updateUser));
  // }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Post('/update-profile')
  async updateUser(
    // @AuthUser() authUser: AuthUserDto,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponseDto<UserEntity>> {
    const updateUser = await this.userService.updateUser(updateUserDto, file);
    return new BaseResponseDto<UserEntity>(plainToClass(UserEntity, updateUser));
  }

  @Get('/user')
  async findUser(@Param('id') id) {
    return await this.userService.getAllUsers();
  }

  @Get('/user-rlt')
  async findUserRLT(@Param('id') id) {
    return await this.userService.getAllUsersRLT();
    // return new BaseResponseDto<UserEntity>(plainToClass(UserEntity, user));
  }
}
