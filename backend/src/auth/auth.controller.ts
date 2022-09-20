import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Ecole42AuthGuard } from './guards/ecole42-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard, TwoFactorJwtAuthGuard } from './guards/jwt-auth.guard';
import { Response, Request } from 'express';
import { TwoFactorCodeDto } from '../users/twoFactorCodeDto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(Ecole42AuthGuard)
  @Get('login')
  ecole42AuthLogin(): void {
    console.log('login');
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

  @Post('2fa_enable')
  @UseGuards(JwtAuthGuard)
  async enable2FactorAuth(
    @Req() request: Request,
    @Body() { code }: TwoFactorCodeDto,
  ) {
    const isValid = this.authService.validate2FactorCode(code, request.user);
    if (!isValid)
      throw new UnauthorizedException('Wrong 2factor authentication code');
    await this.userService.enable2FactorAuth(request.user.id);
  }

  @Post('2fa_disable')
  @UseGuards(TwoFactorJwtAuthGuard)
  async disable2FactorAuth(@Req() request: Request) {
    await this.userService.disable2FactorAuth(request.user.id);
  }

  @Post('2fa_gen')
  @UseGuards(JwtAuthGuard)
  async twoFactorGenerate(@Res() response: Response, @Req() request: Request) {
    const { otpAuthUrl } = await this.authService.generate2FactorSecret(
      request.user,
    );
    return this.authService.get2FactorQRCode(response, otpAuthUrl);
  }

  @Post('2fa_auth')
  @UseGuards(JwtAuthGuard)
  async twoFactorAuth(
    @Req() request: Request,
    @Body() { code }: TwoFactorCodeDto,
  ) {
    const isValid = this.authService.validate2FactorCode(code, request.user);
    if (!isValid)
      throw new UnauthorizedException('Wrong 2factor authentication code');
    return this.authService.login(request.user, true);
  }
}
