import { Controller, Res, Body, Post, UseGuards, Get, Req, Render } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { AuthStatus, UpdatedTokens } from 'src/interfaces';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly userService: UserService) {}

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
        const user = await this.userService.getUser(body);
        if (!user) {
            res.json({ error: 'Bad creditionals' });
            
        } else {
            const { token } = this.authService.createToken(user);
            const { refresh } = this.authService.createRefresh(user);
            res.setHeader('Authorization', `Bearer ${token}`);
            res.cookie('refresh', refresh, { expires: new Date(Date.now() + 7200000), httpOnly: true });
            res.json({
                user_id: user.id
            });
        } 
    }

    @Post('update-token')
    updateToken(@Req() req: Request, @Res() res: Response): void {
        const resp: UpdatedTokens = this.authService.updateToken(req);
        switch (typeof resp) {
            case 'undefined':
                res.json({
                    status: 'Failed',
                    message: 'Logged out'
                });
            break;
            default:
                switch(resp.expired) {
                    case 1:
                        res.setHeader(resp.header[0], resp.header[1]);
                        res.cookie(resp.cookie[0], resp.cookie[1], resp.cookie[2]);
                        res.json({
                            status: 'Success',
                            message: 'Token updated'
                        });
                    break;
                    case 2:
                        res.json({
                            status: 'Failed',
                            message: 'No need to update'
                        });
                    break;
                }
            break;
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    async getArticles(@Res() res: Response): Promise<void> {
        res.cookie('refresh', 'logged out', { expires: new Date(Date.now()), httpOnly: true });
        res.setHeader('Authorization', 'logged out');
        const resp: AuthStatus = {
            status: 'Success',
            message: 'Logged out'
        }
        res.json(resp);
    }
}
