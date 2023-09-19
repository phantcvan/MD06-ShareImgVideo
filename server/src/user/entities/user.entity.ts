import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from 'src/notification/entities/notification.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { ReactPost } from 'src/react_post/entities/react_post.entity';
import { ReactCmt } from 'src/react-cmt/entities/react-cmt.entity';
import { Message } from 'src/message/entities/message.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';

@Entity()
export class User {
  constructor(createUserDto: CreateUserDto) {
    Object.assign(this, createUserDto);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  userCode: string = uuidv4();

  @Column({ unique: true })
  email: string;

  @Column()
  userName: string;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @CreateDateColumn()
  date_join: string;

  @Column()
  gender: number;

  @Column({ type: 'longtext' })
  avatar: string;

  @Column()
  status: number;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.interactUser)
  interactions: Notification[];

  @OneToMany(() => Follow, (follow) => follow.user)
  follow: Follow[];

  @OneToMany(() => Follow, (follow) => follow.friend)
  friend: Follow[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => ReactPost, (reactPost) => reactPost.user)
  reactPost: ReactPost[];

  @OneToMany(() => ReactCmt, (reactCmt) => reactCmt.user)
  reactCmt: ReactPost[];

  @OneToMany(() => Message, (message) => message.user)
  message: Message[];

  @ManyToMany(() => Conversation, (conversation) => conversation.members)
  conversation: Conversation[];
}
