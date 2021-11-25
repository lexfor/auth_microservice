import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig {
  public userPoolId: string;
  public clientId: string;
  public region: string;
  public authority: string;
  constructor(private readonly config: ConfigService) {
    this.userPoolId = config.get('COGNITO_USER_POOL_ID');
    this.clientId = config.get('COGNITO_CLIENT_ID');
    this.region = config.get('COGNITO_REGION');
    this.authority = `https://cognito-idp.${config.get(
      'COGNITO_REGION',
    )}.amazonaws.com/${config.get('COGNITO_USER_POOL_ID')}`;
  }
}
