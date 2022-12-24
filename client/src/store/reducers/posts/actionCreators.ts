import { createAsyncThunk } from '@reduxjs/toolkit';
import PostService from '../../../services/post-service';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (
    args: {
      type: 'blogs-lastest' | 'blogs-hot' | 'blogs-Top';
      page: number;
    },
    thunkAPI
  ) => {
    try {
      const response = await PostService.getPosts(args.type, args.page);
      console.log('response get blog', response);

      return {
        data: response.data,
        type: args.type,
        currentPage: args.page,
      };
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);
