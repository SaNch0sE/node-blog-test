import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import UserDTO from 'src/dto/user.dto';
import Users from 'src/entities/user.entity';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  getAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  getUser(body: UserDTO): Promise<Users> {
    return this.usersRepository.findOneOrFail({ where: { login: body.login } });
  }

  getUserById(id: number): Promise<Users> {
    return this.usersRepository.findOneOrFail(id);
  }

  async createUser(user: UserDTO): Promise<Users | { error: string }> {
    const data: UserDTO = user;
    data.password = bcrypt.hashSync(user.password, 10);
    const nuser = await this.usersRepository.create(data);
    return this.usersRepository.save(nuser);
  }
}
