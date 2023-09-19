import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  members: string;
}
