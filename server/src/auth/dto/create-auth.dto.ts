import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  password: string;
}
