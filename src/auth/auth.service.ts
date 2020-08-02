import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

    getUsers(): Promise<Users[]> {
        return this.usersRepository.find();
    }

    async newUser(user: UserDTO): Promise<Users | { error: string }> {
        if (user.full_name && user.full_name !== '') {
            const data: UserDTO = user;
            data.password = bcrypt.hashSync(user.password, 10);
            const nuser = await this.usersRepository.create(data);
            return this.usersRepository.save(nuser);
        }
        return { error: 'Enter your full name'}
    }

    async signIn(body: UserDTO): Promise<Users | void> {
        const user = await this.usersRepository.findOne({ where: { login: body.login }});
        if(user && bcrypt.compareSync(body.password, user.password)) {
            return user;
        }
    }
}
