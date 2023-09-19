import { Module } from '@nestjs/common';
import { PostMediaService } from './post_media.service';
import { PostMediaController } from './post_media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMedia } from './entities/post_media.entity';
import { Post } from 'src/post/entities/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostMedia, Post, User]), JwtModule],
  controllers: [PostMediaController],
  providers: [PostMediaService],
})
export class PostMediaModule {}
