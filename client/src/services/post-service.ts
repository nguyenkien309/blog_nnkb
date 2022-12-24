import api from '../http';
import { IPost } from '../types/post-type';
import axios, { AxiosResponse } from 'axios';
import { IComment } from '../types/comment-type';
import { ILike } from '../types/like-type';
import { ITag } from '../types/tag-type';

export default class PostService {
  static async createPost(
    picture: any,
    title: string,
    text: string,
    userId: number,
    tags?: ITag[]
  ) {
    const formData = new FormData();
    formData.append('file', picture);
    formData.append('title', title);
    // formData.append('text', text);
    formData.append('content', text);
    formData.append('userId', userId.toString());
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        formData.append('tags[]', JSON.stringify(tag));
      });
    }
    return api.post<IPost>('/v1/blog', formData);
  }

  //   static async createPost(
  //     picture: any,
  //     title: string,
  //     text: string,
  //     userId: number,
  //     tags?: ITag[]
  //   ) {
  //     console.log(title, text);
  //   }

  static async getPosts(
    type: 'blogs-lastest' | 'blogs-hot' | 'blogs-Top',
    page?: number
  ): Promise<AxiosResponse<IPost[]>> {
    return api.get<IPost[]>(`v1/blog/${type}?page=${page}`);
    // return api.get<IPost[]>(`v1/blog/${type}`);
  }

  static async updatePost(
    title: string,
    content: string,
    postId: number,
    picture?: any,
    // tags?: ITag[]
    tags?: any
    //
  ) {
    if (picture) {
      const formData = new FormData();
      // formData.append('title', title);
      // formData.append('content', content);
      // formData.append('blogId', postId.toString());
      formData.append('file', picture);
      if (tags && tags.length > 0) {
        tags.forEach((tag: any) => {
          formData.append('tags', JSON.stringify(tag));
        });
        console.log('tag append', tags);
      }
      return api.patch<IPost>(`/v1/blog/${postId}`, formData);
    }
    return api.patch<IPost>(`/v1/blog/${postId}`, {
      // title,
      // content,
      // postId,
      picture,
    });
  }

  static async deletePost(postId: number) {
    // await api.delete(`/posts/post/${postId}`);
    await api.delete(`/v1/blog/${postId}`);
  }

  //   static async getById(postId: number): Promise<AxiosResponse<IPost>> {
  //     return api.get<IPost>(`/posts/post/${postId}`);
  //   }

  static async getById(postId: number): Promise<AxiosResponse<IPost>> {
    return api.get<IPost>(`/v1/blog/${postId}`);
  }

  static async getByTagId(tagId: number): Promise<AxiosResponse<IPost[]>> {
    // return api.get<IPost[]>(`/posts/tag/${tagId}`);
    return api.get<IPost[]>(`/v1/blog/blogTag/${tagId}`);
  }

  static async createComment(context: string, blogId: number, userId: any) {
    console.log('context api', context);
    console.log('blogId api', blogId);
    console.log('userIdId api', userId);
    return api.post<IComment>(`/v1/blog-comment/${blogId}`, {
      context,
      blogId,
      userId,
    });
    // return api.post<IComment>('/comments', {text, postId, userId})
    // console.log('apiPost', apiPost);

    // const token = JSON.parse(`${localStorage.getItem('token')}`);
    // const data = await axios.post(
    //   `/v1/blog-comment/${postId}`,
    //   { context },
    //   {
    //     headers: { Authorization: `Bearer ${token}` },
    //   }
    // );
    // console.log('data', data);

    // return data;
    // console.log('apiPost', apiPost);
  }

  //   static async createComment(
  //     context: string,
  //     postId: number,
  //     userId: number
  //   ): Promise<AxiosResponse<IComment>> {
  //     console.log('context api', context);
  //     console.log('postId api:', postId);
  //     // return api.post<IComment>('/comments', { text, postId, userId });
  //     // /v1/bglo - comment / 12;
  //     return api.post<IComment>(`/v1/blog-comment/${postId}`, {
  //       context,
  //     });
  //   }

  //   static async likePost(
  //     userId: number,
  //     postId: number
  //   ): Promise<AxiosResponse<ILike>> {
  //     console.log('postId by LIKE', postId);

  //     return api.post<ILike>(`/v1/blog-like/${postId}/like`, { userId, postId });
  //   }

  static async likePost(userId: number, blogId: number) {
    console.log('blogId by LIKE', blogId);
    console.log('userId by LIKE', userId);
    return api.post<ILike>(`/v1/blog-like/${blogId}/like`, {
      blogId,
      userId,
    });
  }

  static async getUserLikeBlog(userId: number, blogId: number) {
    return api.post(`/v1/blog-like/${blogId}`, {
      blogId,
      userId,
    });
  }

  static async getByUserId(userId: number): Promise<AxiosResponse<IPost[]>> {
    // return api.get<IPost[]>(`/posts/user/${userId}`);
    return api.get<IPost[]>(`/v1/blog/${userId}/user-blog`);
  }
}
