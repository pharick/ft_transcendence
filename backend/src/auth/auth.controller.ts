import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Ecole42AuthGuard } from './guards/ecole42-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(Ecole42AuthGuard)
  @Get('login')
  ecole42AuthLogin(): void {
    return;
  }

  @Get('redirect')
  async redirect() {
    return 'Signed in successfully';
  }

  @Get('token')
  @UseGuards(Ecole42AuthGuard)
  async ecole42AuthGetToken(@Req() req: any) {
    return this.authService.login(req.user);
  }
}
