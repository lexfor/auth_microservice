import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../../infrastructure/configs/cognito.config';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class Register {
  private readonly userPool: CognitoUserPool;
  constructor(
    private readonly config: ConfigService,
    private readonly authConfig: AuthConfig,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async register(createUserDto: CreateUserDto): Promise<CognitoUser> {
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        createUserDto.login,
        createUserDto.password,
        [],
        null,
        (error, result) => {
          if (!result) {
            reject(error);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }
}
