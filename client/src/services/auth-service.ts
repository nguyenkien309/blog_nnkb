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
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<AxiosResponse<AuthResponse>> {
    console.log('begin register');
    return api.post<AuthResponse>('/v1/auth/register', {
      name,
      email,
      password,
      passwordConfirmation,
    });
  }
  static async logout(): Promise<void> {
    const data = await api.post('/v1/auth/logout');
    console.log('logOUT DATA', data);

    console.log('LOG OUT DAY');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuth');
  }
}
