import { Controller, Get, Logger, Post, Query, Redirect, Session } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger('AuthController');

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('login')
  @Redirect('/')
  async login(
    @Query('code') code: string,
    @Session() session: Record<string, any>
  ): Promise<void> {
    session.userSessionId = await this.authService.login(code);
    session.userId = this.authService.getUserIdBySessionId(session.userSessionId);
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>): void {
    this.authService.logout(session.userSessionId);
    session.destroy();
  }

  @Get('me')
  async getCurrentUser(@Session() session: Record<string, any>) {
    const userSessionId = session.userSessionId;
    const userId = this.authService.getUserIdBySessionId(userSessionId);
    const user = await this.usersService.findOne(userId);
    return {
      userSessionId: userSessionId || null,
      user: user || null,
    };
  }
}
