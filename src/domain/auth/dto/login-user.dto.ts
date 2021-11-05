import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  login: string;

  @Length(10, 50)
  @IsString()
  @ApiProperty()
  password: string;
}
