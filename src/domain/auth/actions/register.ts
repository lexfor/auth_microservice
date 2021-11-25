import { ConfigService } from '@nestjs/config';
import { v1 as uuidv1 } from 'uuid';
import { AuthConfig } from '../../../infrastructure/configs/cognito.config';
import {
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class Register {
  private readonly userPool: CognitoUserPool;
  constructor(
    private readonly config: ConfigService,
    private readonly authConfig: AuthConfig,
  ) {
    console.log(this.authConfig.userPoolId);
    console.log(this.authConfig.clientId);
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async register(createUserDto: CreateUserDto): Promise<CognitoUser> {
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        createUserDto.login,
        createUserDto.password,
        [new CognitoUserAttribute({ Name: 'custom:id', Value: uuidv1() })],
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
