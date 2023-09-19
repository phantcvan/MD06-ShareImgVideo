import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation) private groupRepo: Repository<Conversation>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async create(createConversationDto: CreateConversationDto) {
    const { members } = createConversationDto;
    const memberIds = members.split(', ').map(Number);
    const existingGroup = await this.groupRepo
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'user')
      // .where('user.id IN (:...memberIds)', { memberIds })
      .getMany();

    const memberIdsSet = new Set(memberIds);
    const foundGroup = existingGroup.find((group) => {
      const groupMemberIds = group.members.map((member) => member.id);
      return (
        memberIds.length === groupMemberIds.length &&
        groupMemberIds.every((id) => memberIdsSet.has(id))
      );
    });

    if (foundGroup) {
      return {
        status: 200,
        group: foundGroup,
      };
    }

    const converCode = uuidv4();
    const groupMembers = await this.userRepo.findByIds(memberIds);
    const newGroup = { converCode, members: groupMembers };
    await this.groupRepo.save(newGroup);

    return {
      status: 201,
      message: 'Group created successfully',
      converCode,
    };
  }

  async findAllByUserId(id: number) {
    const allGroups = await this.groupRepo
      .createQueryBuilder('group')
      .leftJoin('group.members', 'user')
      .leftJoin('group.message', 'message')
      .addSelect([
        'user.id',
        'user.userCode',
        'user.avatar',
        'user.userName',
        'user.fullName',
      ])
      .orderBy('message.date', 'DESC')
      .where('message.id IS NOT NULL')
      .getMany();

    if (allGroups.length > 0) {
      const groups = allGroups.filter((group) =>
        group.members.some((member) => member.id === id),
      );
      return {
        status: 200,
        groups,
      };
    } else {
      return {
        status: 404,
        message: 'Have no group chat',
      };
    }
  }

  async findOneByGroupCode(code: string) {
    const group = await this.groupRepo
      .createQueryBuilder('group')
      .where('group.converCode = :code', { code })
      .leftJoin('group.members', 'user')
      .addSelect([
        'user.id',
        'user.userCode',
        'user.avatar',
        'user.userName',
        'user.fullName',
      ])
      .getOne();
    if (group) {
      return {
        status: 200,
        group,
      };
    } else {
      return {
        status: 404,
        message: 'Have no group with code ' + code,
      };
    }
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
