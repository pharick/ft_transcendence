import {Injectable, Logger} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

import { UsersService } from "../users/users.service";
import {response} from "express";

@Injectable()
export class AuthService {
  private logger: Logger = new Logger('AuthService');

  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
  ) {}

  private getUser(token: string) {
    this.httpService.get(
      'https://api.intra.42.fr/v2/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).subscribe({
      next: response => {
        this.logger.log(response.data);
      }
    })
  }

  login(code: string) {
    this.httpService.post(
      'https://api.intra.42.fr/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: '8a4a10a3a225a1b0315f1872a786036f3104d8206cfd0a95b8ec2c48c5ac1d9a',
        client_secret: 'f12a693d067cd5c662393089c00dfca52920efbcea5d79e21ed333df5c25e9e2',
        code: code,
        redirect_uri: 'http://localhost:3000/api/auth/login',
      }
    ).subscribe({
      next: response => {
        const token: string = response.data.access_token;
        this.getUser(token);
      },
      error: error => {
        this.logger.log(error);
      },
    });
  }
}
