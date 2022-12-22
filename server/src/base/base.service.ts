import { PAGE_SIZE } from './../config/config';
import { LoggerService } from '../logger/custom.logger';
import { IBaseService } from './i.base.service';
import { BaseEntity, FindOptionsOrder, FindOptionsWhere, In, Repository, DataSource, DeleteResult } from 'typeorm';
// tim
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EntityId } from 'typeorm/repository/EntityId';
import { InjectDataSource } from '@nestjs/typeorm';

export class BaseService<T extends BaseEntity, R extends Repository<T>> implements IBaseService<T> {
  protected readonly repository: R;
  protected readonly logger: LoggerService;
  constructor(repository: R, logger: LoggerService) {
    this.repository = repository;
    this.logger = logger;
  }

  // USER
  //ADMIN
  async _findByDeleted(deleted: boolean, sort: boolean, page: 0): Promise<T[] | null> {
    return await this.repository.find({
      where: { deleted: deleted } as unknown as FindOptionsWhere<T>,
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
      order: { createdAt: sort ? 1 : -1 } as unknown as FindOptionsOrder<T>,
    });
  }

  index(): Promise<T[]> {
    return this.repository.find();
  }

  async _store(data: any): Promise<T | null> {
    return this.repository.save(data, { transaction: true });
  }

  async _findById(id: EntityId): Promise<T | null> {
    return this.repository.findOne({
      where: { id: id } as unknown as FindOptionsWhere<T>,
    });
  }

  async _findByIds(ids: [EntityId]): Promise<T[] | null> {
    return this.repository.find({
      where: { id: In(ids) } as unknown as FindOptionsWhere<T>,
    });
  }

  async _update(id: EntityId, data: any): Promise<T> {
    await this.repository.update(id, data);
    return this._findById(id);
  }

  delete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
