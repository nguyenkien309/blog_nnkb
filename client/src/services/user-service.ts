import api from '../http';
import { IUser } from '../types/user-type';
import { AxiosResponse } from 'axios';

export default class UserService {
  static async updateUser(
    userId: number,
    firstName: string,
    lastName: string,
    name: string,
    email: string,
    picture?: any
  ): Promise<AxiosResponse<IUser>> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('name', name);
    formData.append('email', email);
    if (picture) {
      console.log('picture');
      formData.append('file', picture);
    }

    // return api.put<IUser>('/auth/update', formData);
    return api.post<IUser>('/v1/auth/update-profile', formData);
  }
}
