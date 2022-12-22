import { BlogEntity } from './../../blog/entities/blog.entity';
import { DateAudit } from 'src/base/date_audit.entity';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class TagEntity extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ name: 'blogId', nullable: true })
  // blogId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  constructor(partial: Partial<TagEntity>) {
    super();
    Object.assign(this, partial);
  }
}
