import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Follow } from 'src/follow/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow]), JwtModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
