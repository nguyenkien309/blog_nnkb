import { BlogLikeEntity } from './entities/blog-like.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogLikeRepository extends Repository<BlogLikeEntity> {
  constructor(@InjectRepository(BlogLikeEntity) private repository: Repository<BlogLikeEntity>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  getA(): Promise<BlogLikeEntity[]> {
    return this.repository.find();
  }
}
