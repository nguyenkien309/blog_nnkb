import { IComment } from './comment-type';
import { IUser } from './user-type';
import { ILike } from './like-type';
import { ITag } from './tag-type';

export interface IPost {
  id: number;
  blogId: any;
  title: string;
  dateAndTimePublish: Date;
  blogImage: string;
  content: string;
  comments: IComment[];
  userLikes: ILike[];
  tags: ITag[];
  user: IUser;
  body: any;
  numLike: number;
}
