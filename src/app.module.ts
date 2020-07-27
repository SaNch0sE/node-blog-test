import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppMiddleware } from './app.middleware';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ViewModule } from './view/view.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    BlogModule,
    ViewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AppMiddleware)
      .forRoutes({
        path: '*', method: RequestMethod.ALL
      });
  }
}