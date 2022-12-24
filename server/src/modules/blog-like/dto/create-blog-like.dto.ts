import { IsNotEmpty } from 'class-validator';

export class CreateBlogLikeDto {
  @IsNotEmpty()
  blogId: number;

  @IsNotEmpty()
  userId: number;
}
