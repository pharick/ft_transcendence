import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ecole42AuthGuard } from './guards/ecole42-auth.guard';

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @UseGuards(Ecole42AuthGuard)
  @Get('login')
  login(): void {
    return;
  }

  @Get('redirect')
  @UseGuards(Ecole42AuthGuard)
  async ecole42AuthRedirect(@Req() req: any) {
    return this.authService.login(req.user);
  }
}
