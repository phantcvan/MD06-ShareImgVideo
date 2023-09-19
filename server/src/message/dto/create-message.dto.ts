import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  group_code: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  user_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  mess: string;
}
