import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) private notiRepo: Repository<Notification>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const { user_id, interact_id, type, post_id } = createNotificationDto;
    const interactUser = await this.userRepo.findOne({
      where: { id: interact_id },
    });
    const status = 1;
    if (user_id !== interactUser.id) {
      if (type === 'comment' || type === 'like') {
        const post = await this.postRepo.findOne({
          where: { id: post_id },
          relations: ['user'],
        });
        if (interactUser && post) {
          const newNoti = {
            user: post.user,
            interactUser,
            status,
            type,
            postCode: post.postCode,
          };
          await this.notiRepo.save(newNoti);
          return {
            status: 200,
            message: 'Create Notification Successfully',
          };
        } else {
          return {
            status: 404,
            message: 'User or Post not found',
          };
        }
      } else if (type === 'follow' || type === 'lock') {
        const user = await this.userRepo.findOne({
          where: { id: user_id },
        });
        const status = 1;
        if (interactUser && user) {
          const newNoti = {
            user: user,
            interactUser,
            status,
            type,
            postCode: null,
          };
          await this.notiRepo.save(newNoti);
          return {
            status: 200,
            message: 'Create Notification Successfully',
          };
        } else {
          return {
            status: 404,
            message: 'User not found',
          };
        }
      }
    }
  }

  async findAllBelongUser(id) {
    const allNoti = await this.notiRepo
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.interactUser', 'interactUser')
      .select([
        'notification',
        'interactUser.id',
        'interactUser.userName',
        'interactUser.avatar',
        'interactUser.userCode',
      ])
      .where('notification.user_id = :id', { id })
      .getMany();
    return allNoti;
  }

  async countNoti(id: number) {
    const allNoti = await this.notiRepo.find({
      where: { user: { id }, status: 1 },
    });
    return {
      status: 200,
      newNoti: allNoti.length,
    };
  }

  async update(id: number) {
    const allNoti = await this.notiRepo.find({ where: { user: { id } } });
    if (allNoti.length > 0) {
      const newData = allNoti.map((item) => ({ ...item, status: 0 }));
      await this.notiRepo.save(newData);
    }
    if (allNoti.length > 15) {
      const newData = allNoti.slice(allNoti.length - 15);
      await this.notiRepo.save(newData);
    }
    return `Update status successfully`;
  }

  async remove(deleteNotificationDto: CreateNotificationDto) {
    const { user_id, interact_id, type } = deleteNotificationDto;
    const findNoti = await this.notiRepo.findOne({
      where: { user: { id: user_id }, interactUser: { id: interact_id }, type },
    });
    if (findNoti) {
      await this.notiRepo.remove(findNoti);
      return {
        status: 200,
        message: 'Delete Notification Successfully',
      };
    } else {
      return {
        status: 404,
        message: 'Notification Not Found',
      };
    }
  }
}
