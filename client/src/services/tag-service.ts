import api from '../http';
import { ITag } from '../types/tag-type';
import { AxiosResponse } from 'axios';

export default class TagService {
  static async createTag(name: string, description: string, color: string) {
    return api.post<ITag>('v1/tag', { name, description, color });
  }

  static async getTags(): Promise<AxiosResponse<ITag[]>> {
    console.log('GET TAG AT API');

    return api.get<ITag[]>('v1/tag');
  }

  static async getTagById(tagId: number): Promise<AxiosResponse<ITag>> {
    return api.get<ITag>(`/v1/tag/${tagId}`);
  }
}
