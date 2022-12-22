import api from '../http';
import { IUser } from '../types/user-type';
import { AxiosResponse } from 'axios';

export default class UserService {
  static async updateUser(picture?: any): Promise<AxiosResponse<IUser>> {
    const formData = new FormData();
    if (picture) {
      console.log('picture', picture);
      formData.append('file', picture);
    }

    // return api.put<IUser>('/auth/update', formData);
    return api.post<IUser>('/v1/auth/update-profile', formData);
  }
}
