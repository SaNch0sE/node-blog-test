import {
  IAuthStatus,
  IPayload,
  ITokens,
} from 'src/interfaces';
import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import UserDTO from 'src/dto/user.dto';
import { RedisService } from 'nestjs-redis';
import { JwtService } from '@nestjs/jwt';
import UsersService from '../users/users.service';

@Injectable()
export default class AuthService {
  private readonly redisClient: Redis;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = redisService.getClient();
  }

  async register(user: UserDTO): Promise<IAuthStatus> {
    const status: IAuthStatus = {
      status: 'Success',
      message: 'No errors',
    };
    try {
      await this.usersService.createUser(user);
    } catch (err) {
      status.status = 'Error';
      status.message = err;
    }
    return status;
  }

  async login(login): Promise<ITokens> {
    const { id } = await this.usersService.getUser(login);
    const payload = { user_id: id };

    const accessToken = this.jwtService.sign(
      payload,
      { expiresIn: process.env.ACCESS_EXPIRES },
    );

    const refreshToken = this.jwtService.sign(
      payload,
      { expiresIn: process.env.REFRESH_EXPIRES },
    );

    const key = payload.user_id.toString();
    await this.redisClient.set(
      key,
      refreshToken,
      'EX',
      86400,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  getRefreshTokenById(id: number): Promise<string> {
    return this.redisClient.get(id.toString());
  }

  deleteTokenById(id: number): Promise<number> {
    return this.redisClient.del(id.toString());
  }

  deleteAllTokens(): Promise<string> {
    return this.redisClient.flushall();
  }

  async validateUserToken(payload: IPayload): Promise<UserDTO> {
    const user = await this.usersService.getUserById(payload.user_id);
    return user;
  }

  async validateUser(body: UserDTO): Promise<IAuthStatus | null> {
    const user = await this.usersService.getUser(body.login);
    let authStatus: IAuthStatus;
    if (user && bcrypt.compareSync(body.password, user.password)) {
      authStatus = {
        status: 'Success',
        message: 'No errors',
      };
    }
    return authStatus;
  }
}
