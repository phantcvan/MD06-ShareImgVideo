import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private cmtRepo: Repository<Comment>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { content, user_id, post_id, level, cmt_reply } = createCommentDto;
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    const post = await this.postRepo.findOne({ where: { id: post_id } });
    if (user && post) {
      let cmt;
      if (cmt_reply > 0) {
        cmt = await this.cmtRepo.findOne({ where: { id: cmt_reply } });
        if (cmt) {
          const newCmt = {
            content,
            level,
            cmt_reply: cmt.id,
            user,
            post,
          };
          await this.cmtRepo.save(newCmt);
          return {
            status: 201,
            message: 'Comment reply created successfully',
          };
        } else {
          return {
            status: 404,
            message: 'Comment reply not found',
          };
        }
      }
      if (cmt_reply === -1) {
        const newCmt = {
          content,
          level,
          cmt_reply,
          user,
          post,
        };
        await this.cmtRepo.save(newCmt);
        return {
          status: 201,
          message: 'Comment created successfully',
        };
      }
    } else if (!user) {
      return {
        status: 404,
        message: 'User not found',
      };
    } else if (!post) {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }

  async findAllBelongPost(postCode: string) {
    const allCmt = await this.cmtRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.post', 'post')
      .leftJoinAndSelect('comment.user', 'user')
      .where('post.postCode=:postCode', { postCode })
      .select(['user.userCode', 'user.avatar', 'user.userName', 'comment'])
      .orderBy('comment.cmt_date', 'DESC')
      .getMany();

    return {
      status: 200,
      allCmt,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const { content } = updateCommentDto;
    const comment = await this.cmtRepo.findOne({ where: { id } });
    if (comment) {
      comment.content = content;
      await this.cmtRepo.save(comment);
      return {
        status: 200,
        message: 'Comment updated successfully',
      };
    } else {
      return {
        status: 404,
        message: 'Comment not found',
      };
    }
  }

  async remove(id: number) {
    const comment = await this.cmtRepo.findOne({ where: { id } });
    if (comment) {
      await this.cmtRepo.remove(comment);
      return {
        status: 200,
        message: 'Comment deleted successfully',
      };
    } else {
      return {
        status: 404,
        message: 'Comment not found',
      };
    }
  }
}
