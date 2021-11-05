import { ApiProperty } from '@nestjs/swagger';

export class PatientSwagger {
  @ApiProperty()
  private readonly id: string;
  @ApiProperty()
  private readonly name: string;
  @ApiProperty()
  private readonly birthday: string;
  @ApiProperty()
  private readonly gender: string;
  @ApiProperty()
  private readonly mail: string;
  @ApiProperty()
  private readonly user_id: string;
}
