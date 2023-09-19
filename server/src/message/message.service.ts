import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Conversation) private groupRepo: Repository<Conversation>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const { group_code, user_id, mess } = createMessageDto;
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    const group = await this.groupRepo.findOne({
      where: { converCode: group_code, members: { id: user_id } },
    });
    if (group && user) {
      const newMess = {
        user,
        conversation: group,
        mess,
      };
      await this.messageRepo.save(newMess);
      return {
        status: 201,
        message: 'Message saved successfully',
      };
    } else {
      return {
        status: 404,
        message: 'Group not found',
      };
    }
  }

  async getLastMess(converCode: string, userId: number) {
    const lastMess = await this.messageRepo
      .createQueryBuilder('mess')
      .leftJoin('mess.conversation', 'conversation')
      .where('conversation.converCode = :converCode', { converCode })
      .orderBy('mess.date', 'DESC')
      .leftJoin('mess.user', 'user')
      .addSelect(['user.userName', 'mess'])
      .getOne();
    let last = lastMess;
    if (lastMess.deleted_by !== null) {
      const listUserDeletedMessage = lastMess.deleted_by
        .split(', ')
        .map((item) => Number(item));
      if (listUserDeletedMessage.includes(userId)) {
        last = null;
      }
    }
    return last;
  }

  async findAllBelongGroup(converCode: string, userId: string) {
    const allMess = await this.messageRepo
      .createQueryBuilder('mess')
      .leftJoin('mess.conversation', 'conversation')
      .where('conversation.converCode = :converCode', { converCode })
      .leftJoin('mess.user', 'user')
      .addSelect([
        'user.id',
        'user.userCode',
        'user.avatar',
        'user.userName',
        'user.fullName',
        'mess',
      ])
      .getMany();
    if (allMess.length > 0) {
      const messFilter = allMess.filter((mess) =>
        mess.deleted_by ? !mess.deleted_by.split(', ').includes(userId) : true,
      );

      return {
        status: 200,
        messFilter,
      };
    } else {
      return {
        stauts: 404,
        message: 'Have no message',
      };
    }
  }

  async update(groupCode: string, userId: string) {
    const allMess = await this.messageRepo
      .createQueryBuilder('mess')
      .leftJoin('mess.conversation', 'conversation')
      .where('conversation.converCode = :groupCode', { groupCode })
      .getMany();

    const updatedData = allMess.map((item) => {
      if (item.deleted_by === null) {
        item.deleted_by = `${userId}`;
      } else if (!item.deleted_by.split(', ').includes(userId)) {
        item.deleted_by = `${item.deleted_by}, ${userId}`;
      }
      return item;
    });

    await this.messageRepo.save(updatedData);
    return {
      status: 200,
      message: 'Deleted successfully',
    };
  }

  remove(groupCode: string) {
    return `This action removes a #${groupCode} message`;
  }
}
