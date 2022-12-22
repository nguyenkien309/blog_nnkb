import { IPost } from './post-type';

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  profilePicture: string;
  posts: IPost[];
  isActive: boolean;
  body: any;
}
