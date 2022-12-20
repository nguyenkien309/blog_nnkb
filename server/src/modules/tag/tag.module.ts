import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';
import { TagEntity } from './entities/tag.entity';
import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService, TagRepository],
})
export class TagModule {}
