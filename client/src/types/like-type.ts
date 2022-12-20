import { IUser } from './user-type';
import { IPost } from './post-type';

export interface ILike {
  id: number;
  blogId: string;
  user: IUser;
  post: IPost;
  data: any;
  like: boolean;
}
