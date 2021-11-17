import {
  Body,
  Controller,
  DefaultValuePipe,
  HttpCode,
  HttpException,
  HttpStatus,
  OnModuleInit,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Login } from './actions/login';
import { roles } from '../../infrastructure/constants';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { IUserService } from './interfaces/users.service.interface';
import { IPatientService } from './interfaces/patients.service.interface';
import { ICreatePatientMessage } from './interfaces/create-patient-message.interface';
import { IToken } from './interfaces/token.interface';
import { lastValueFrom } from 'rxjs';
import { join } from 'path';
import { IPatientMessage } from './interfaces/patient-message.interface';
import { IUser } from './interfaces/user.interface';
import { IPatient } from './interfaces/patient.interface';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PatientSwagger } from './interfaces/patient-swagger';
import { TokenSwagger } from './interfaces/token-swagger';

@ApiTags('Users')
@Controller('api/auth')
export class AuthController implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: 'ec2-18-217-138-210.us-east-2.compute.amazonaws.com',
      package: 'lab',
      protoPath: join(__dirname, '../../../grpc/grpc.proto'),
    },
  })
  client: ClientGrpc;
  private userService: IUserService;
  private patientService: IPatientService;

  constructor(private readonly loginClass: Login) {}

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
    const foundedUser: IUser = await lastValueFrom(
      this.userService.getUser({
        login: createUserDto.login,
        password: createUserDto.password,
        role: roles.patient,
      }),
    );
    if (foundedUser.id === null) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }
    const user: IUser = await lastValueFrom(
      this.userService.createUser(createUserDto),
    );
    const createPatientMessage: ICreatePatientMessage = {
      name: createUserDto.name,
      mail: createUserDto.login,
      birthday: createUserDto.birthday,
      gender: createUserDto.gender,
      userID: user.id,
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
  }

  @ApiAcceptedResponse({
    description: 'access token',
    type: TokenSwagger,
  })
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async getUserByLogin(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
    @Query('role', new DefaultValuePipe(roles.patient)) role: string,
  ): Promise<IToken> {
    const user: IUser = await lastValueFrom(
      this.userService.getUser({
        ...loginUserDto,
        role: role,
      }),
    );
    if (user.id === null) {
      throw new HttpException(
        'wrong login or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.loginClass.login(user);
  }
}
