import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Type(() => String)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Type(() => String)
  password: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  bio: string;
}
