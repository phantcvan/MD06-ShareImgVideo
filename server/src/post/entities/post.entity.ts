import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostMedia } from 'src/post_media/entities/post_media.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { ReactPost } from 'src/react_post/entities/react_post.entity';

@Entity()
export class Post {
  constructor(createPostDto: CreatePostDto) {
    Object.assign(this, createPostDto);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  content: string;

  @CreateDateColumn()
  post_time: string;

  @Column()
  status: number;

  @Column({ type: 'longtext' })
  postCode: string;

  @ManyToOne(() => User, (user) => user.post, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PostMedia, (media) => media.post)
  media: PostMedia[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];

  @OneToMany(() => ReactPost, (reactPost) => reactPost.post)
  reactPost: ReactPost[];
}
