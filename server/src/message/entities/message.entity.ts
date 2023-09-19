import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Message {
  constructor(createMessageDto: CreateMessageDto) {
    Object.assign(this, createMessageDto);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  mess: string;

  @CreateDateColumn()
  date: string;

  @Column({ nullable: true })
  deleted_by: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.message, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.message, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Conversation;
}
