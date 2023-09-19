import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateCommentDto } from './../dto/create-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { ReactCmt } from 'src/react-cmt/entities/react-cmt.entity';

@Entity()
export class Comment {
  constructor(createCommentDto: CreateCommentDto) {
    Object.assign(this, createCommentDto);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  cmt_date: string;

  @Column()
  level: number;

  @Column()
  cmt_reply: number;

  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => ReactCmt, (reactCmt) => reactCmt.comment)
  reactCmt: ReactCmt[];
}
