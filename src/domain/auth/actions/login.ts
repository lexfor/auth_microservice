import { AuthConfig } from '../../../infrastructure/configs/cognito.config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { Injectable } from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class Login {
  private readonly userPool: CognitoUserPool;
  constructor(private readonly authConfig: AuthConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<CognitoUserSession> {
    const authenticationDetails = new AuthenticationDetails({
      Username: loginUserDto.login,
      Password: loginUserDto.password,
    });
    const userData = {
      Username: loginUserDto.login,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
