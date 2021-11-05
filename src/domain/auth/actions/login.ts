import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IToken } from '../interfaces/token.interface';
import { IUser } from '../interfaces/user.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Login {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ id }: IUser): Promise<IToken> {
    return {
      token: await this.jwtService.signAsync({ id }),
    };
  }
}
