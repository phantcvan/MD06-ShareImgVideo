import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostMediaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  mediaUrl: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  post_id: number;
}
