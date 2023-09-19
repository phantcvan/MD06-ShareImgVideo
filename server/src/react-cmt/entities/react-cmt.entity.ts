import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreateReactCmtDto } from '../dto/create-react-cmt.dto';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class ReactCmt {
  constructor(createReactCmtDto: CreateReactCmtDto) {
    Object.assign(this, createReactCmtDto);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reactCmt, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.reactCmt, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cmt_id' })
  comment: Comment;
}
