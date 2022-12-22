import axios from 'axios';
import { AuthResponse } from '../types/auth-response';

//export const API_URL = "https://deploy-nest-react-blog-app.herokuapp.com";
export const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  // withCredentials: true,
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  // @ts-ignore
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  console.log('token config', localStorage.getItem('token'));
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      localStorage.removeItem('token');
      originalRequest._isRetry = true;
      try {
        const refresh_token = localStorage.getItem('refreshToken');
        console.log('getRT from http', refresh_token);
        console.log('POST RET');

        const response = await axios.post<AuthResponse>(
          `${API_URL}/v1/auth/refresh`,
          { refresh_token }
          // { withCredentials: true }
        );
        console.log('response INDEX.TS', response);
        localStorage.setItem('token', response.data.accessToken);
        console.log('response.data.accessToken', response.data.accessToken);

        return api.request(originalRequest);
      } catch (e) {
        console.log('Unauthorized');
      }
    }
    throw error;
  }
);

export default api;
