import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Notification {
  constructor(createNotiDto: CreateNotificationDto) {
    Object.assign(this, createNotiDto);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @CreateDateColumn()
  date: string;

  @Column()
  status: number;

  @Column({ nullable: true })
  postCode: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) //người nhận thông báo
  user: User;

  @ManyToOne(() => User, (interactUser) => interactUser.interactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'interact_id' }) //người tương tác
  interactUser: User;
}
