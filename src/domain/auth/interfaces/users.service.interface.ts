import { CreateUserDto } from '../dto/create-user.dto';
import { Observable } from 'rxjs';
import { IGetUserMessage } from './get-user-message.interface';
import { IUser } from './user.interface';

export interface IUserService {
  createUser(data: CreateUserDto): Observable<IUser>;
  getUser(data: IGetUserMessage): Observable<IUser>;
}
