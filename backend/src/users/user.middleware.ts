import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from './users.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.session.userId;
    if (userId) req.user = await this.usersService.findOne(userId);
    next();
  }
}
