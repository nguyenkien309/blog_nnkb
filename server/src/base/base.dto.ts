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

export class AuthUserDto {
  id: string;
  email: string;
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
