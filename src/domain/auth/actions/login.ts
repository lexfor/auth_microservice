import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class Login {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login() {

  }
}
