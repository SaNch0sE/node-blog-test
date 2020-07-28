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
    async newUser(@Body() body: UserDTO, @Res() res: Response): Promise<void> {
        const articles = await this.authService.newUser(body);
        res.json(articles);
    }
}
