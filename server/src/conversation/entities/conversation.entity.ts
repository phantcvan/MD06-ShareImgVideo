import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Conversation {
  constructor(createConversationDto: CreateConversationDto) {
    Object.assign(this, createConversationDto);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  converCode: string;

  @OneToMany(() => Message, (message) => message.conversation)
  message: Message[];

  @ManyToMany(() => User, (members) => members.conversation)
  @JoinTable()
  members: User[];
}
