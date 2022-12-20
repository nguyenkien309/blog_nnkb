import { BlogCommentEntity } from './entities/blog-comment.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogCommentRepository extends Repository<BlogCommentEntity> {
  constructor(@InjectRepository(BlogCommentEntity) private repository: Repository<BlogCommentEntity>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  getA(): Promise<BlogCommentEntity[]> {
    return this.repository.find();
  }
}
