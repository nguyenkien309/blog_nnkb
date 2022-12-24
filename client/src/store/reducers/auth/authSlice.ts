import { IUser } from '../../../types/user-type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '../../../types/auth-response';
import { authorizeUser, logoutUser } from './actionCreators';
import { Navigate, redirect } from 'react-router-dom';
interface AuthState {
  user: IUser;
  isAuth: boolean;
  refreshToken: string;
  isLoading: boolean;
  error: string;
}
const initialState: AuthState = {
  user: {} as IUser,
  // user: JSON.parse(localStorage.getItem('userInfo') || ''),
  // isAuth: false,
  isAuth: JSON.parse(localStorage.getItem('isAuth') || 'false'),
  refreshToken: JSON.parse(
    JSON.stringify(localStorage.getItem('refreshToken'))
  ),
  isLoading: false,
  error: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state: AuthState, action: PayloadAction<IUser>) {
      // state.user = action.payload;
      state.user = action.payload;
    },
    setError(state: AuthState, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  extraReducers: {
    [authorizeUser.pending.type]: (state: AuthState, action) => {
      state.error = '';
      state.isLoading = true;
    },
    [authorizeUser.fulfilled.type]: (
      state: AuthState,
      action: PayloadAction<AuthResponse>
    ) => {
      // console.log('authorizeUser', authorizeUser.pending.type);
      // localStorage.setItem('token', action?.payload?.body?.token?.accessToken);
      // localStorage.setItem(
      //   'token',
      //   action.payload.body.token.accessToken ||
      //     JSON.parse(JSON.stringify(action?.payload))
      // );
      console.log('DATA AUTHSLICE', action.payload);

      localStorage.setItem(
        'token',
        action?.payload?.body?.token?.accessToken ||
          action?.payload?.accessToken
      );
      console.log('payload data', action.payload);

      localStorage.setItem(
        'refreshToken',
        action?.payload?.body?.token?.refreshToken ||
          action?.payload?.refreshToken
      );
      localStorage.setItem(
        'role',
        action?.payload?.body?.role || action?.payload?.role
      );
      // localStorage.setItem('role', action.payload.user.role);
      state.isLoading = false;
      state.isAuth = true;
      localStorage.setItem('isAuth', JSON.stringify(state.isAuth));
      // state.user = action?.payload?.body || action.payload;
      state.user = action.payload.body;
      // localStorage.setItem('userInfo', JSON.stringify(state.user));
      state.error = '';
    },
    [authorizeUser.rejected.type]: (
      state: AuthState,
      action: PayloadAction<any>
    ) => {
      const error = action.payload;
      if (error.response) {
        if (Array.isArray(error.response.data.message)) {
          state.error = error.response.data.message[0];
        } else {
          state.error = error.response.data.message;
        }
      }
      state.isLoading = false;
    },
    [logoutUser.fulfilled.type]: (state: AuthState, action) => {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuth');
      localStorage.removeItem('role');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      state.user = {} as IUser;
      state.isAuth = false;
    },
    [logoutUser.rejected.type]: (
      state: AuthState,
      action: PayloadAction<any>
    ) => {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuth');
      localStorage.removeItem('role');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      console.log('ERRORRRRRRRRRRRR LOG');
      // window.location.reload();
      window.location.href = 'http://localhost:3000/login';
      state.error = action.payload.response.data.message;
    },
  },
});

export default authSlice.reducer;
export const { setUser, setError } = authSlice.actions;
