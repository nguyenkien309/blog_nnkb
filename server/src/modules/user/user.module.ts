import { UploadService } from './../upload-file/upload-file.service';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './controller/user.controller';
import { UserEntity } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriber } from './subscriber/user.subscriber';
import { UploadFileController } from '../upload-file/upload-file.controller';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserSubscriber, UserRepository, UploadService],
  exports: [UserService],
})
export class UserModule {}
