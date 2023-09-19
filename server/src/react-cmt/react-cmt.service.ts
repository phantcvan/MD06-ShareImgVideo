import { Injectable } from '@nestjs/common';
import { CreateReactCmtDto } from './dto/create-react-cmt.dto';
import { UpdateReactCmtDto } from './dto/update-react-cmt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReactCmt } from './entities/react-cmt.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class ReactCmtService {
  constructor(
    @InjectRepository(ReactCmt) private reactCmtRepo: Repository<ReactCmt>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Comment) private cmtRepo: Repository<Comment>,
  ) {}
  async create(createReactCmtDto: CreateReactCmtDto) {
    const { user_id, cmt_id } = createReactCmtDto;
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    const comment = await this.cmtRepo.findOne({ where: { id: cmt_id } });
    if (user && comment) {
      const newReactCmt = {
        user,
        comment,
      };
      await this.reactCmtRepo.save(newReactCmt);
      return {
        status: 201,
        message: 'Create react Cmt successfully',
      };
    } else if (!user) {
      return {
        status: 404,
        message: 'User not found',
      };
    } else if (!comment) {
      return {
        status: 404,
        message: 'Comment not found',
      };
    }
  }

  async findAllBelongCmt(id: number) {
    const comment = await this.cmtRepo.findOne({ where: { id } });
    if (comment) {
      const allReactCmt = await this.reactCmtRepo
        .createQueryBuilder('react')
        .leftJoinAndSelect('react.user', 'user')
        .leftJoin('react.comment', 'comment')
        .where('comment.id=:id', { id })
        .select(['user.userCode', 'react'])
        .getMany();
      return {
        status: 200,
        allReactCmt,
      };
    } else {
      return {
        status: 404,
        message: 'Comment not found',
      };
    }
  }

  update(id: number, updateReactCmtDto: UpdateReactCmtDto) {
    return `This action updates a #${id} reactCmt`;
  }

  async remove(userId: number, cmtId: number) {
    const reaction = await this.reactCmtRepo.findOne({
      where: { user: { id: userId }, comment: { id: cmtId } },
    });
    if (reaction) {
      await this.reactCmtRepo.remove(reaction);
      return {
        status: 200,
        message: 'Reaction Comment deleted successfully',
      };
    } else {
      return {
        status: 404,
        message: 'Reaction Comment not found',
      };
    }
  }
}
