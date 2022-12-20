import { UserEntity } from './../user/entities/user.entity';
import { AuthUser } from './../../decorator/auth.user.decorator';
import { UserService } from 'src/modules/user/user.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { cloudinary } from 'src/utils/cloudinary';
import { UpdateUserDto } from 'src/base/base.dto';

@Injectable()
export class UploadService {
  async createFile(file: Express.Multer.File) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '../static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

      return this.uploadToCloudinary(filePath, fileName);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async uploadToCloudinary(filePath: string, fileName: string) {
    try {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };
      const image = await cloudinary.uploader.upload(`${filePath}/${fileName}`, options);

      return image.url;
    } catch (e) {
      console.log(e);
    }
  }

  async testUpload(userId: EntityId, file) {
    console.log(file);
  }
  //   async updateUser(userId: EntityId, updateUserDto: UpdateUserDto, file): Promise<UserEntity> {
  //     const updateUser = new UserEntity(updateUserDto);
  //     const checkAvatar = await this.userService._findById(userId);
  //     // const { picture } = file;
  //     // const picturePath = await this.createFile(picture[0]);
  //     // return picturePath;
  //     // const updateUserAvatar = checkAvatar;
  //     // return await this.userService._update(userId, updateUserAvatar);
  //     let picturePath;
  //     if ('picture' in file) {
  //       const { picture } = file;
  //       const picturePath = await this.createFile(picture[0]);
  //     }
  //     const name = updateUserDto.name;
  //     const email = updateUserDto.email;
  //     if (picturePath) {
  //       await this.userService._update(userId, {
  //         name,
  //         email,
  //         avatar: picturePath,
  //       });
  //     } else {
  //       await this.userService._update(userId, { name, email });
  //     }
  //     return this.userService._findById(userId);
  //   }
}
