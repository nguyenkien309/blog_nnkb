import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';

@Injectable()
export class BlogRepository extends Repository<BlogEntity> {
  constructor(@InjectRepository(BlogEntity) private repository: Repository<BlogEntity>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
