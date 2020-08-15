import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.set('views', join(__dirname, '..', 'views'));
  app.set('view engine', 'ejs');
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
