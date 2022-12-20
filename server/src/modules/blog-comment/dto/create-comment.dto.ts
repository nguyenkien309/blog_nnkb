import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  readonly context: string;

  @IsNotEmpty()
  readonly blogId: number;

  @IsNotEmpty()
  readonly userId: string;
}
