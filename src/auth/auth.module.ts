import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users]),
  /*PassportModule.register({      
      defaultStrategy: 'jwt',      
      property: 'user_id',      
      session: false,    
  }), */],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
