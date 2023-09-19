import { Injectable } from '@nestjs/common';
import { CreateReactPostDto } from './dto/create-react_post.dto';
import { UpdateReactPostDto } from './dto/update-react_post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReactPost } from './entities/react_post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class ReactPostService {
  constructor(
    @InjectRepository(ReactPost) private reactPostRepo: Repository<ReactPost>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  async create(createReactPostDto: CreateReactPostDto) {
    const { user_id, post_id } = createReactPostDto;
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    const post = await this.postRepo.findOne({ where: { id: post_id } });
    if (user && post) {
      const newReactPost = {
        user,
        post,
      };
      await this.reactPostRepo.save(newReactPost);
      return {
        status: 201,
        message: 'Create react post successfully',
      };
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
    const post = await this.postRepo.findOne({ where: { postCode } });
    if (post) {
      const allReactPost = await this.reactPostRepo
        .createQueryBuilder('react')
        .leftJoinAndSelect('react.user', 'user')
        .leftJoin('react.post', 'post')
        .where('post.postCode=:postCode', { postCode })
        .select([
          'user.userCode',
          'user.avatar',
          'user.userName',
          'user.fullName',
          'react',
        ])
        .getMany();
      return {
        status: 200,
        allReactPost,
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }

  async checkReaction(userId: number, postCode: string) {
    const find = await this.reactPostRepo.findOne({
      where: {
        user: { id: userId },
        post: { postCode },
      },
    });
    if (find) {
      return {
        status: 200,
        find,
      };
    } else {
      return {
        status: 404,
        message: 'Reaction not found',
      };
    }
  }

  update(id: number, updateReactPostDto: UpdateReactPostDto) {
    return `This action updates a #${id} reactPost`;
  }

  async remove(userId: number, postId: number) {
    const reaction = await this.reactPostRepo.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });
    if (reaction) {
      await this.reactPostRepo.remove(reaction);
      return {
        status: 200,
        message: 'Reaction Post deleted successfully',
      };
    } else {
      return {
        status: 404,
        message: 'Reaction Post not found',
      };
    }
  }
}
