import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import UsersController from './users/users.controller';
import UsersModule from './users/users.module';
import AppMiddleware from './app.middleware';
import AuthModule from './auth/auth.module';
import BlogModule from './blog/blog.module';
import BlogController from './blog/blog.controller';
import AppController from './app.controller';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    RedisModule.register({
      url: `redis://127.0.0.1:${process.env.REDIS_PORT}`,
      onClientReady: async (client): Promise<void> => {
        client.on('error', console.error);
        client.on('ready', () => console.log('redis is running on 7001 port'));
        client.on('restart', () => console.log('attempt to restart the redis server'));
      },
      reconnectOnError: (): boolean => true,
    }),
    AuthModule,
    BlogModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
})
export default class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppMiddleware).forRoutes(BlogController);
  }
}
