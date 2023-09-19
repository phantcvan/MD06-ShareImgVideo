import { Module } from '@nestjs/common';
import { ReactPostService } from './react_post.service';
import { ReactPostController } from './react_post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactPost } from './entities/react_post.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ReactPost, Post, User]), JwtModule],
  controllers: [ReactPostController],
  providers: [ReactPostService],
})
export class ReactPostModule {}
