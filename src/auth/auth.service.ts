import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

    getUsers(): Promise<Users[]> {
        return this.usersRepository.find();
    }

    async newUser(user: UserDTO): Promise<Users> {
        const nuser = await this.usersRepository.create(user);
        return this.usersRepository.save(nuser);
    }
}
