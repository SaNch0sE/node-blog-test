import { Controller, Res, Body, Get, Post } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Users } from 'src/entities/user.entity';
import { UserDTO } from 'src/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('users')
    async getUsers(@Res() res: Response): Promise<void> {
        const users: Users[] = await this.authService.getUsers();
        res.json(users);
    }

    @Post('register')
    async signUp(@Body() body: UserDTO, @Res() res: Response): Promise<void> {
        const user = await this.authService.newUser(body);
        res.json(user);
    }

    @Post('login')
    async signIn(@Body() body: UserDTO, @Res() res: Response): Promise<void> {
        const user = await this.authService.signIn(body);
        if (user) {
            res.json({ user_id: user.id });
        } else {
            res.json({ error: 'Bad creditionals' });
        } 
    }
}
