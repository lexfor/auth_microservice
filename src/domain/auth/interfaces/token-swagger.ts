import { ApiProperty } from '@nestjs/swagger';

export class TokenSwagger {
  @ApiProperty()
  private readonly token: string;
}
