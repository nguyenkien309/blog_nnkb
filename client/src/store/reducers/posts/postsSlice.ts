import { IPost } from '../../../types/post-type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPosts } from './actionCreators';

interface PostsState {
  posts: IPost[];
  isLoading: boolean;
  postsType: 'blogs-lastest' | 'blogs-hot' | 'blogs-Top';
  error: string;
  todayPosts: IPost[];
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  postsType: 'blogs-lastest',
  error: '',
  todayPosts: [],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    removePost(state: PostsState, action: PayloadAction<IPost>) {
      state.posts = state.posts.filter((p) => p.id !== action.payload.id);
    },
  },
  extraReducers: {
    [fetchPosts.pending.type]: (state: PostsState, action) => {
      state.posts = [];
      state.error = '';
      state.isLoading = true;
    },
    [fetchPosts.fulfilled.type]: (
      state: PostsState,
      action: PayloadAction<{
        data: IPost[];
        type: 'blogs-lastest' | 'blogs-hot' | 'blogs-Top';
      }>
    ) => {
      state.isLoading = false;
      if (action.payload.type === 'blogs-lastest') {
        state.todayPosts = action.payload.data.slice(0, 5);
      }
      state.posts = action.payload.data;
      state.postsType = action.payload.type;
    },
    [fetchPosts.rejected.type]: (
      state: PostsState,
      action: PayloadAction<any>
    ) => {
      state.isLoading = false;
      state.error = action.payload.response.data.message;
    },
  },
});

export default postsSlice.reducer;
export const { removePost } = postsSlice.actions;
