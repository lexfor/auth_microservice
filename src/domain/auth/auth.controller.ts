import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  OnModuleInit,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Login } from './actions/login';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { IUserService } from './interfaces/users.service.interface';
import { IPatientService } from './interfaces/patients.service.interface';
import { ICreatePatientMessage } from './interfaces/create-patient-message.interface';
import { lastValueFrom } from 'rxjs';
import { join } from 'path';
import { IPatientMessage } from './interfaces/patient-message.interface';
import { IPatient } from './interfaces/patient.interface';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PatientSwagger } from './interfaces/patient-swagger';
import { TokenSwagger } from './interfaces/token-swagger';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Register } from './actions/register';

@ApiTags('Users')
@Controller('api/auth')
export class AuthController implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: 'ec2-18-217-138-210.us-east-2.compute.amazonaws.com:3001',
      package: 'lab',
      protoPath: join(__dirname, '../../../grpc/grpc.proto'),
    },
  })
  client: ClientGrpc;
  private userService: IUserService;
  private patientService: IPatientService;

  constructor(
    private readonly loginClass: Login,
    private readonly registerClass: Register,
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<IUserService>('UsersService');
    this.patientService =
      this.client.getService<IPatientService>('PatientService');
  }

  @ApiCreatedResponse({
    description: 'registered patient',
    type: PatientSwagger,
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<IPatient> {
    try {
      await this.registerClass.register(createUserDto);
      const user: CognitoUserSession = await this.loginClass.login({
        login: createUserDto.login,
        password: createUserDto.password,
      });
      console.log(user);
      const userID: string = user.getAccessToken().payload.username;
      const createPatientMessage: ICreatePatientMessage = {
        name: createUserDto.name,
        mail: createUserDto.login,
        birthday: createUserDto.birthday,
        gender: createUserDto.gender,
        userID: userID,
      };
      const patient: IPatientMessage = await lastValueFrom(
        this.patientService.createPatient(createPatientMessage),
      );
      return {
        id: patient.id,
        name: patient.name,
        mail: patient.mail,
        birthday: patient.birthday,
        gender: patient.gender,
        user_id: patient.userID,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiAcceptedResponse({
    description: 'access token',
    type: TokenSwagger,
  })
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async getUserByLogin(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
  ): Promise<string> {
    try {
      const result = await this.loginClass.login(loginUserDto);
      return result.getAccessToken().getJwtToken();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
