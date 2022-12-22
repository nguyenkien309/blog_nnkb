import { BlogLikeEntity } from './../../blog-like/entities/blog-like.entity';
import { BlogCommentEntity } from './../../blog-comment/entities/blog-comment.entity';
import { BlogEntity } from './../../blog/entities/blog.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { DateAudit } from './../../../base/date_audit.entity';
import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/constant/role.enum';

@Entity({ name: 'users' })
export class UserEntity extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    name: 'avatar',
    default:
      'https://firebasestorage.googleapis.com/v0/b/post-images-storage.appspot.com/o/%2Fposts%2Fsquare_avatar.png?alt=media&token=1bf5a1c9-9691-45dc-bd26-b2d1753f7c53',
  })
  avatar: string;

  @Column({ name: 'role', type: 'varchar', default: Role.USER })
  role: string;

  // @OneToMany(() => BlogEntity, (blog) => blog.user)
  // blog: BlogEntity[];

  @OneToMany(() => BlogEntity, (post) => post.user)
  blogs: BlogEntity[];

  // @OneToMany(() => BlogEntity, (post) => post.user)
  // posts: BlogEntity[];

  @OneToMany(() => BlogCommentEntity, (comment) => comment.user)
  comments: BlogCommentEntity[];

  @OneToMany(() => BlogLikeEntity, (like) => like.user)
  likedBlogs: BlogLikeEntity[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: '', name: 'refreshToken', nullable: true })
  refreshToken: string;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
