import { createTagDto } from './dto/create-tag.dto';
import { TagRepository } from './tag.repository';
import { TagEntity } from './entities/tag.entity';
import { LoggerService } from '../../logger/custom.logger';
import { BaseService } from 'src/base/base.service';
import { Injectable } from '@nestjs/common';
import { retry } from 'rxjs';

@Injectable()
export class TagService extends BaseService<TagEntity, TagRepository> {
  constructor(repository: TagRepository, logger: LoggerService) {
    super(repository, logger);
  }

  async findAllTag() {
    return this.repository.find();
  }

  async findTag(tagId: number) {
    return this._findById(tagId);
  }

  async createTag(createTagDto: createTagDto) {
    return this._store(createTagDto);
  }

  async deleteTag(tagId: number) {
    return this._delete(tagId);
  }
}
