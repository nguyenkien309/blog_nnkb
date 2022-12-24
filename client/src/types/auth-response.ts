import { IUser } from './user-type';

export interface AuthResponse {
  token: any;
  accessToken: string;
  refreshToken: string;
  user: IUser;
  body: any;
  role: string;
}
