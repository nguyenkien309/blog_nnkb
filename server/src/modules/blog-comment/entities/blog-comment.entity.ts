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
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity[];

  @Column()
  blogId: number;

  @ManyToOne(() => BlogEntity, (blog) => blog.id, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;

  @ManyToOne(() => BlogEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  post: number;

  // @ManyToOne(() => BlogEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  // blog: number;

  constructor(partial: Partial<BlogCommentEntity>) {
    super();
    Object.assign(this, partial);
  }
}
