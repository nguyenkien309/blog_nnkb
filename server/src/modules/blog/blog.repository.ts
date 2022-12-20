// import { EntityRepository, Repository } from 'typeorm';
// import { BlogEntity } from './entities/blog.entity';

// @EntityRepository(BlogEntity)
// export class BlogRepository extends Repository<BlogEntity> {}

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';

@Injectable()
export class BlogRepository extends Repository<BlogEntity> {
  constructor(@InjectRepository(BlogEntity) private repository: Repository<BlogEntity>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  getA(): Promise<BlogEntity[]> {
    return this.repository.find();
  }
}
