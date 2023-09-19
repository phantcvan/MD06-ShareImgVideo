import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatePostMediaDto } from './../dto/create-post_media.dto';
import { Post } from 'src/post/entities/post.entity';

@Entity()
export class PostMedia {
  constructor(createPostMediaDto: CreatePostMediaDto) {
    Object.assign(this, createPostMediaDto);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'longtext' })
  mediaUrl: string;

  @ManyToOne(() => Post, (post) => post.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
