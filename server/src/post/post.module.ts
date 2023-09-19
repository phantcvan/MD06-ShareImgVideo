import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { Comment } from 'src/comment/entities/comment.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { ReactPost } from 'src/react_post/entities/react_post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment, Follow, ReactPost]),
    JwtModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
