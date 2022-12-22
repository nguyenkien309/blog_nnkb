import { UserRepository } from './user.repository';
import { LoggerService } from '../../logger/custom.logger';
import { BaseService } from './../../base/base.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UploadService } from '../upload-file/upload-file.service';
import * as bcrypt from 'bcrypt';
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

  testABC(user) {
    console.log('user', user);

    return user;
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email: email } });
  }

  async updateRefreshToken(filter, Token) {
    // if (Token.refreshToken) {
    //   Token.refreshToken = await bcrypt.hash(this.reverseToken(Token.refreshToken), 10);
    // }
    return await this._update(filter, Token);
  }

  async updateUser(userId, updateUserDto: UpdateUserDto, file): Promise<UserEntity> {
    const findUser = await this._findById(userId.payload.id);
    console.log('update profile', userId);
    const updateUser = new UserEntity(updateUserDto);

    const filepath = await this.uploadService.createFile(file);
    if (filepath) {
      updateUser.avatar = filepath;
    }
    return await this._update(userId.payload.id, updateUser);
    // return findUser;
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
