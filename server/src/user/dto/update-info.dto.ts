import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  userCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  admin_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  type: string;
}
