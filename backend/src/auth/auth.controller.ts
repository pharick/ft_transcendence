import { Controller, Get, Logger, Post, Query, Redirect, Session } from '@nestjs/common';

import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Get('login')
  @Redirect('/')
  async login(
    @Query('code') code: string,
    @Session() session: Record<string, any>
  ): Promise<void> {
    const user = await this.authService.login(code);
    session.userId = user.id;
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>): void {
    session.destroy();
  }
}
