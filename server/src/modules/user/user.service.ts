import { UserRepository } from './user.repository';
import { LoggerService } from './../logger/custom.logger';
import { BaseService } from './../../base/base.service';
import { RegisterRequestDto } from './../auth/dto/register-request.dto';
import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { DataSource, ObjectID, UpdateResult } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { UploadService } from '../upload-file/upload-file.service';
import * as bcrypt from 'bcrypt';
// import { UpdateUserDto } from 'src/base/base.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService extends BaseService<UserEntity, UserRepository> {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    repository: UserRepository,
    logger: LoggerService,
    private readonly uploadService: UploadService,
  ) {
    super(repository, logger);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email: email } });
  }

  async updateRefreshToken(filter, Token) {
    if (Token.refreshToken) {
      Token.refreshToken = await bcrypt.hash(this.reverseToken(Token.refreshToken), 10);
    }
    return await this._update(filter, Token);
  }

  async updateUser(updateUserDto: UpdateUserDto, file): Promise<UserEntity> {
    // const userId = updateUserDto.userId;
    const findUser = await this._findById(updateUserDto.id);
    // console.log('update profile', userId);
    // const updateUser = new UserEntity(updateUserDto);
    const filepath = await this.uploadService.createFile(file);
    if (filepath) {
      updateUserDto.avatar = filepath;
    }
    console.log('updateUserDto.id', updateUserDto.id);
    console.log(findUser);
    console.log('filepath', filepath);

    return this._update(updateUserDto.id, updateUserDto);
    return;
  }

  reverseToken(plainText: string) {
    return plainText.split('').reverse().join('');
  }

  async getAllUsers() {
    return await this.repository.find({
      // relations: ['blogs', 'comments'],
    });
  }

  async getAllUsersRLT() {
    return await this.repository.find({
      relations: ['blogs', 'comments'],
    });
  }

  test() {
    return 'test';
  }
}
