import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Login } from './actions/login';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../../infrastructure/configs/jwt.config';
import { JwtStrategy } from '../../infrastructure/strategies/jwt.strategy';
import config from '../../infrastructure/config';
import { AuthConfig } from '../../infrastructure/configs/cognito.config';
import { Register } from './actions/register';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          load: [config],
        }),
      ],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [Login, Register, JwtStrategy, AuthConfig],
})
export class AuthModule {}
