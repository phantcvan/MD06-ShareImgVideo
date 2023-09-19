import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @ManyToOne(() => User, (user) => user.follow, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) //người nhận thông báo
  user: User;

  @ManyToOne(() => User, (friend) => friend.follow, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'friend_id' }) //người tương tác
  friend: User;
}
