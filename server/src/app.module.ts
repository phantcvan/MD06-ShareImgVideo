import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/entities/notification.entity';
import { PostModule } from './post/post.module';
import { FollowModule } from './follow/follow.module';
import { Follow } from './follow/entities/follow.entity';
import { Post } from './post/entities/post.entity';
import { PostMediaModule } from './post_media/post_media.module';
import { PostMedia } from './post_media/entities/post_media.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { ReactPostModule } from './react_post/react_post.module';
import { ReactPost } from './react_post/entities/react_post.entity';
import { ReactCmtModule } from './react-cmt/react-cmt.module';
import { ReactCmt } from './react-cmt/entities/react-cmt.entity';
import { MessageModule } from './message/message.module';
import { Message } from './message/entities/message.entity';
import { ConversationModule } from './conversation/conversation.module';
import { Conversation } from './conversation/entities/conversation.entity';
import { AccessLogModule } from './access-log/access-log.module';
import { AccessLog } from './access-log/entities/access-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: configService.get<boolean>('DATABASE_SYNC'),
        logging: configService.get<boolean>('DATABASE_LOGGING'),
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],
        entities: [
          Auth,
          User,
          Notification,
          Follow,
          Post,
          PostMedia,
          Comment,
          ReactPost,
          ReactCmt,
          Message,
          Conversation,
          AccessLog,
        ],
      }),
    }),
    AuthModule,
    UserModule,
    NotificationModule,
    PostModule,
    FollowModule,
    PostMediaModule,
    CommentModule,
    ReactPostModule,
    ReactCmtModule,
    MessageModule,
    ConversationModule,
    AccessLogModule,
  ],
})
export class AppModule {}
