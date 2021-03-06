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
  signUpView(): void {}

  @Get('login')
  @Render('login')
  signInView(): void {}

  /*
  //// Api calls
  */
  @Post('register')
  async signUp(@Body() body: UserDTO, @Res() res: Response): Promise<void> {
    const user = await this.authService.register(body);
    res.json(user);
  }

  @Post('login')
  async signIn(@Body() body: UserDTO, @Res() res: Response): Promise<void> {
    const user = await this.usersService.getUser(body.login);
    if (!user) {
      res.json({ error: 'Bad creditionals' });
    } else {
      const tokens = await this.authService.login(user.id);
      res.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
      res.cookie('refresh', tokens.refreshToken, {
        expires: new Date(Date.now() + 7200000),
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      res.json({
        user_id: user.id,
      });
    }
  }

  @Post('update-token')
  async updateToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken = req.cookies.refresh;
    const verifiedUser = this.jwtService.verify(refreshToken);
    const oldRefreshToken = await this.authService.getRefreshTokenById(verifiedUser.user_id);
    // if the old refresh token is not equal to request refresh token then this user is unauthorized
    if (!oldRefreshToken || oldRefreshToken !== refreshToken) {
      throw new UnauthorizedException('Authentication credentials were missing or incorrect');
    }

    const payload: IPayload = {
      user_id: verifiedUser.id,
    };

    const newTokens = await this.authService.login({ id: payload.user_id });
    res.setHeader('Authorization', `Bearer ${newTokens.accessToken}`);
    res.cookie('refresh', newTokens.refreshToken, {
      expires: new Date(Date.now() + 7200000),
      httpOnly: true,
      sameSite: true,
      secure: true,
    });
    res.json(newTokens);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async getArticles(@Body() body: { user_id: number }, @Res() res: Response): Promise<void> {
    this.authService.deleteTokenById(body.user_id);
    const resp: IAuthStatus = {
      status: 'Success',
      message: 'Logged out',
    };
    res.json(resp);
  }
}
