import { IUser } from './user-type';
import { IPost } from './post-type';

export interface IComment {
  id: number;
  context: string;
  dateAndTimePublish: Date;
  user: IUser;
  post: IPost;
  createdAt: any;
  avatar: string;
}
