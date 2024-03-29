import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/message/entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation, User]), JwtModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
