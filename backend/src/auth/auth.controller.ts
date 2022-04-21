import { Controller, Get, Logger, Query } from "@nestjs/common";

import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Get('login')
  isAuth(@Query('code') code: string) {
    this.authService.login(code);
    return {code: code};
  }
}
