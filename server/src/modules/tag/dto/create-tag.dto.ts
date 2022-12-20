import { IsNotEmpty, IsString } from 'class-validator';

export class createTagDto {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty()
  name: string;

  @IsString({ message: 'Description must be string' })
  @IsNotEmpty()
  description: string;
}
