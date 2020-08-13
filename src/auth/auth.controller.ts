import {
  Controller,
  Res,
  Body,
  Post,
  UseGuards,
  Get,
  Req,
  Render,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { IAuthStatus, IPayload } from 'src/interfaces';
import UserDTO from 'src/dto/user.dto';
import UsersService from '../users/users.service';
import AuthService from './auth.service';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('register')
  @Render('register')
  signUpView(): null {
    return null;
  }

  @Get('login')
  @Render('login')
  signInView(): null {
    return null;
  }

  /*
  //// Api calls
  */
  @Post('register')
  async signUp(@Body() body: UserDTO, @Res() res: Response): Promise<void> {
    const user = await this.authService.register(body);
    res.json(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async signIn(@Body() body: UserDTO, @Res() res: Response): Promise<void> {
    const user = await this.usersService.getUser(body.login);
    if (!user) {
      res.json({ error: 'Bad creditionals' });
    } else {
      const tokens = await this.authService.login(user);
      res.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
      res.cookie('refresh', tokens.refreshToken, {
        expires: new Date(Date.now() + 7200000),
        httpOnly: true,
      });
      res.json({
        user_id: user.id,
      });
    }
  }

  @Post('update-token')
  @UseGuards(AuthGuard('jwt'))
  async updateToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken = req.cookies.refresh;
    const verifiedUser = this.jwtService.verify(refreshToken);
    const oldRefreshToken = this.authService.getRefreshTokenById(verifiedUser.user_id);

    // if the old refresh token is not equal to request refresh token then this user is unauthorized
    if (!oldRefreshToken || oldRefreshToken !== refreshToken) {
      throw new UnauthorizedException('Authentication credentials were missing or incorrect');
    }

    const payload: IPayload = {
      user_id: verifiedUser.id,
    };

    const newTokens = await this.authService.login({ id: payload.user_id });
    res.json(newTokens);
    res.setHeader('Authorization', `Bearer ${newTokens.accessToken}`);
    res.cookie('refresh', newTokens.refreshToken, {
      expires: new Date(Date.now() + 7200000),
      httpOnly: true,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async getArticles(@Res() res: Response): Promise<void> {
    res.cookie('refresh', 'logged out', {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.setHeader('Authorization', 'logged out');
    const resp: IAuthStatus = {
      status: 'Success',
      message: 'Logged out',
    };
    res.json(resp);
  }
}
