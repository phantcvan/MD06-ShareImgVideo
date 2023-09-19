import { Module } from '@nestjs/common';
import { ReactCmtService } from './react-cmt.service';
import { ReactCmtController } from './react-cmt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactCmt } from './entities/react-cmt.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ReactCmt, User, Comment]), JwtModule],
  controllers: [ReactCmtController],
  providers: [ReactCmtService],
})
export class ReactCmtModule {}
