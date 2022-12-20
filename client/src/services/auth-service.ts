import { AxiosResponse } from 'axios';
import { AuthResponse } from '../types/auth-response';
import api from '../http/index';

export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>('/v1/auth/login', { email, password });
  }

  static async registration(
    name: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<AxiosResponse<AuthResponse>> {
    console.log('begin register');
    return api.post<AuthResponse>('/v1/auth/register', {
      firstName,
      lastName,
      name,
      email,
      password,
      passwordConfirmation,
    });
  }
  static async logout(): Promise<void> {
    console.log('LOG OUT DAY');

    return api.post('/v1/auth/logout');
  }
}
