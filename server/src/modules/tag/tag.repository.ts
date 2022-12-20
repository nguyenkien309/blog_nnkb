import { TagEntity } from './entities/tag.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagRepository extends Repository<TagEntity> {
  constructor(@InjectRepository(TagEntity) private repository: Repository<TagEntity>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  getA(): Promise<TagEntity[]> {
    return this.repository.find();
  }
}
