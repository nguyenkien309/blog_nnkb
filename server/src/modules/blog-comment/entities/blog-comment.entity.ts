import { BlogEntity } from './../../blog/entities/blog.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DateAudit } from './../../../base/date_audit.entity';

@Entity({ name: 'comment' })
export class BlogCommentEntity extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  context: string;

  @Column({ name: 'userId', nullable: true })
  userId: string;

  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.id, {
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity[];

  @Column()
  blogId: number;

  @ManyToOne(() => BlogEntity, (blog) => blog.id, { cascade: true })
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;

  constructor(partial: Partial<BlogCommentEntity>) {
    super();
    Object.assign(this, partial);
  }
}
