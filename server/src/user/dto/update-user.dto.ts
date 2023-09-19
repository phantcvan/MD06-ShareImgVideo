import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @Type(() => String)
  bio: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  avatar: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  gender: number;
}
