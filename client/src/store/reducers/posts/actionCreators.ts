import { createAsyncThunk } from '@reduxjs/toolkit';
import PostService from '../../../services/post-service';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (
    args: { type: 'blogs-lastest' | 'blogs-hot' | 'blogs-Top' },
    thunkAPI
  ) => {
    try {
      const response = await PostService.getPosts(args.type);
      return {
        data: response.data,
        type: args.type,
      };
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);
