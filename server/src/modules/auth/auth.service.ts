import { RefreshTokenGuard } from './guards/refresh-auth.guard';
import { JWT_EXPIRES_IN, JWT_REFESH_EXPIRES_IN, JWT_SECRET_KEY, JWT_SECRET_REFESH_KEY } from './../../config/config';
import { AuthUserDto } from './../../base/base.dto';
import { ErrorCode } from './../../constant/errorCode.enum';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { EntityId } from 'typeorm/repository/EntityId';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async validateUser(email: string, password: string): Promise<UserEntity | undefined> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(ErrorCode.LOGIN_FAIL);
    }
    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult) {
      throw new UnauthorizedException(ErrorCode.LOGIN_FAIL);
    }
    return user;
  }

  async logout(Data) {
    await this.userService._update(Data.id, { refreshToken: '' });
    return Data;
  }

  async login(request: LoginRequestDto): Promise<any> {
    const user = await this.userService.findByEmail(request.email);
    if (!user) {
      throw new UnauthorizedException(ErrorCode.LOGIN_FAIL);
    }
    const compareResult = await bcrypt.compare(request.password, user.password);
    if (!compareResult) {
      throw new UnauthorizedException(ErrorCode.LOGIN_FAIL);
    }
    if (!user.isActive) {
      throw new UnauthorizedException(ErrorCode.DISABLED_ACCOUNT);
    }
    if (user.deleted) {
      throw new HttpException(ErrorCode.DELETED_ACCOUNT, HttpStatus.BAD_REQUEST);
    }
    const payload: AuthUserDto = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    const token = await this.createToken(payload, true);
    // const acessToken = await this.createToken(payload);
    // const refreshToken = await this.createRefreshToken(payload);
    // await this.userService.updateRT(
    //   { email: user.email },
    //   {
    //     refreshToken: refreshToken,
    //   },
    // );
    return { ...user, token };
  }

  async createToken(payload: AuthUserDto, refreshRT: boolean) {
    const accessToken = await this.jwtService.signAsync({ payload });
    if (refreshRT) {
      const refreshToken = await this.jwtService.signAsync(
        { payload },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFESH_KEY'),
          expiresIn: this.configService.get<string>('JWT_REFESH_EXPIRES_IN'),
        },
      );
      await this.userService.updateRefreshToken(
        { email: payload.email },
        {
          refreshToken: refreshToken,
        },
      );
      return {
        expiresIn: process.env.JWT_EXPIRES_IN,
        accessToken,
        refreshToken,
        expiresInRefresh: process.env.JWT_REFESH_EXPIRES_IN,
      };
    } else {
      return {
        expiresIn: process.env.EXPIRESIN,
        accessToken,
      };
    }
  }

  async refresh(refreshToken: string) {
    const verifyToken = await this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET_REFESH_KEY,
    });
    const user = this.userService.findByEmail(verifyToken.email);
    if (user) {
      const token = await this.createToken(verifyToken, false);
      return {
        email: verifyToken.payload.email,
        ...token,
      };
    }
  }
}
