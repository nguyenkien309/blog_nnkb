import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  readonly context: string;

  @IsNotEmpty()
  readonly blogId: number;

  @IsNotEmpty()
  @IsOptional()
  readonly userId?: string;
}
