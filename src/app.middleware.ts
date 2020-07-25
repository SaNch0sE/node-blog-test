import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: () => void): void {
    Logger.log(`Request -> ${req.rawHeaders}`, 'NestRouter', true);
    next();
  }
}
