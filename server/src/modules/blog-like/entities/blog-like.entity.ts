import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BlogEntity } from './../../blog/entities/blog.entity';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { DateAudit } from './../../../base/date_audit.entity';

@Entity({ name: 'blog_like' })
export class BlogLikeEntity extends DateAudit {
  @PrimaryColumn({ name: 'blogId' })
  blogId: number;

  @PrimaryColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.likedBlogs, { eager: true })
  user: number;

  @ManyToOne(() => BlogEntity, (post) => post.userLikes)
  blog: number;

  constructor(partial: Partial<BlogLikeEntity>) {
    super();
    Object.assign(this, partial);
  }
}
