import { BlogCommentEntity } from './../../blog-comment/entities/blog-comment.entity';
import { BlogLikeEntity } from './../../blog-like/entities/blog-like.entity';
import { DateAudit } from 'src/base/date_audit.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { TagEntity } from 'src/modules/tag/entities/tag.entity';

@Entity({ name: 'blogs' })
export class BlogEntity extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ default: 0, nullable: true })
  numSeen: number;

  @Column({ default: 0, nullable: true })
  numLike: number;

  @Column({ default: 0, nullable: true })
  numComment: number;

  @Column({ nullable: true })
  blogImage: string;

  @Column({ name: 'userId', nullable: true })
  userId: number;

  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.id, {
    eager: true,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => BlogCommentEntity, (comment) => comment.blog, { eager: true })
  comments: BlogCommentEntity[];

  @OneToMany(() => BlogLikeEntity, (like) => like.blog, { eager: true })
  userLikes: BlogLikeEntity[];

  @ManyToMany(() => TagEntity, { eager: true })
  @JoinTable()
  tags: TagEntity[];

  constructor(partial: Partial<BlogEntity>) {
    super();
    Object.assign(this, partial);
  }
}
