import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { Login } from './actions/login';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../infrastructure/strategies/jwt.strategy';
import config from '../../infrastructure/config';
import { AuthConfig } from '../../infrastructure/configs/cognito.config';
import { Register } from './actions/register';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [Login, Register, JwtStrategy, AuthConfig],
})
export class AuthModule {}
