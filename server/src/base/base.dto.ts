import { MessageCode } from 'src/constant/messageCode.enum';

export class BaseResponseDto<T> {
  message: string;
  body: T;

  constructor(body: T | null = null, message = MessageCode.SUCCESS) {
    this.message = message;
    if (body instanceof String) {
      this.body = { ...body };
    } else {
      this.body = body;
    }
  }
}

interface payload {
  id: string;
}

export class AuthUserDto {
  id: number;
  email: string;
  role: string;
  payload?: any;
}

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
}

export class UpdateUserDto {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;

  @IsOptional()
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @IsOptional()
  filter?: { [key: string]: any };

  @IsOptional()
  sort?: { by: string; direction: 'ASC' | 'DESC' };
}
