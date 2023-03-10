import { redirect } from 'react-router-dom';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../../services/auth-service';
import axios from 'axios';
import { AuthResponse } from '../../../types/auth-response';
import { API_URL } from '../../../http';

export interface authArgs {
  type: 'login' | 'register' | 'checkAuth';
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export const authorizeUser = createAsyncThunk(
  'auth/login',
  async (args: authArgs, thunkAPI) => {
    try {
      let response;
      // const refresh_token = localStorage.getItem('refreshToken');
      if (args.type === 'login') {
        response = await AuthService.login(args.email!, args.password!);
        console.log('LOGIN DATA', response);
        // localStorage.setItem('token', response.data.body.token.accessToken);
        // localStorage.setItem('refreshToken', response.data.body.refreshToken);
        // localStorage.setItem('role', response.data.body.role);
        localStorage.setItem('user', response.data.body.id);
      } else if (args.type === 'register') {
        response = await AuthService.registration(
          args.name!,
          args.email!,
          args.password!,
          args.passwordConfirmation!
        );
        // console.log('response registraions', response.data);
        // localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      console.log('response REFRESH TOKEN', response);

      return response?.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (args, thunkAPI) => {
    try {
      await AuthService.logout();
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);
