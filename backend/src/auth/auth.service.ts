import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger('AuthService');

  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
  ) {
  }

  private async getUserData(token: string): Promise<any> {
    const observable = await this.httpService.get(
      'https://api.intra.42.fr/v2/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).pipe(map(response => response.data));
    return lastValueFrom(observable);
  }

  private async findOrCreateUser(username: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return await this.usersService.create({ username: username });
    }
    return user;
  }

  async login(code: string): Promise<User> {
    const tokenObservable = await this.httpService.post(
      'https://api.intra.42.fr/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: '8a4a10a3a225a1b0315f1872a786036f3104d8206cfd0a95b8ec2c48c5ac1d9a',
        client_secret: 'f12a693d067cd5c662393089c00dfca52920efbcea5d79e21ed333df5c25e9e2',
        code: code,
        redirect_uri: 'http://localhost:3000/api/auth/login',
      },
    ).pipe(map(response => response.data));

    const tokenData = await lastValueFrom(tokenObservable);
    const accessToken = tokenData.access_token;

    const userData = await this.getUserData(accessToken);
    const username = userData.login;

    return await this.findOrCreateUser(username);
  }
}
