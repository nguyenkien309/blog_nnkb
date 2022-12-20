import { AuthUser } from './../../decorator/auth.user.decorator';
import { AuthUserDto } from './../../base/base.dto';
import { UpdateUserDto } from './../user/dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { UploadService } from './upload-file.service';
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('/v1/upload-file')
@UseGuards(JwtAuthGuard)
export class UploadFileController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@AuthUser() authUser: AuthUserDto, @UploadedFile() file: Express.Multer.File) {
    // return this.uploadService.testUpload(authUser.id, file);

    return this.uploadService.createFile(file);
  }

  //   @Post('/upload')
  //   @UseInterceptors(FileInterceptor('picture'))
  //   uploadFile(
  //     @AuthUser() authUser: AuthUserDto,
  //     @Body() updateUserDto: UpdateUserDto,
  //     @UploadedFile() file: Express.Multer.File,
  //   ) {
  //     return this.uploadService.updateUser(authUser.id, updateUserDto, file);
  //   }

  //   @Post('/upload')
  //   @UseInterceptors(FileInterceptor('files'))
  //   uploadFile(@UploadedFile() files: Array<Express.Multer.File>) {
  //     console.log(files);
  //   }
}
