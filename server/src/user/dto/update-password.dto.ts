import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  @Type(() => String)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  @Type(() => String)
  newPassword: string;
}
