import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsOptional()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  interact_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  type: string;

  @ApiProperty()
  @IsOptional()
  post_id: number;
}
