import { UserEntity } from './../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './../user/user.repository';
import { UserSubscriber } from './../user/subscriber/user.subscriber';
import { UserService } from 'src/modules/user/user.service';
import { UploadService } from './upload-file.service';
import { Module } from '@nestjs/common';
import { UploadFileController } from './upload-file.controller';

@Module({
  controllers: [UploadFileController],
  providers: [UploadService],
})
export class UploadFileModule {}
