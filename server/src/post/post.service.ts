import { Follow } from 'src/follow/entities/follow.entity';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Comment } from 'src/comment/entities/comment.entity';
import { ReactPost } from 'src/react_post/entities/react_post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Comment) private cmtRepo: Repository<Comment>,
    @InjectRepository(Follow) private followRepo: Repository<Follow>,
    @InjectRepository(ReactPost) private reactPostRepo: Repository<ReactPost>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { content, user_id } = createPostDto;
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (user) {
      const postCode = uuidv4();
      const status = 1;
      const newPost = {
        user,
        content,
        postCode,
        status,
      };
      const postCreated = await this.postRepo.save(newPost);
      return {
        status: 201,
        message: 'Create Post Successfully',
        post_id: postCreated.id,
      };
    } else {
      return {
        status: 404,
        message: 'User not found',
      };
    }
  }

  // search
  async search(start: number, query: string) {
    const keyword = query.toLowerCase();
    try {
      const items_per_page = 10;
      const startIndex = (Number(start) - 1) * items_per_page;
      const [allPosts, total] = await this.postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.media', 'media')
        .leftJoinAndSelect('post.user', 'user')
        .where(
          `LOWER(post.content) LIKE :keyword OR LOWER(user.userName) LIKE :keyword`,
          {
            keyword: `%${keyword}%`,
          },
        )
        .orderBy('post.id', 'DESC')
        .take(items_per_page)
        .skip(startIndex)
        .select([
          'user.userCode',
          'user.avatar',
          'user.userName',
          'post',
          'media',
        ])
        .getManyAndCount();
      const posts = allPosts.map((post) => ({
        id: post.id,
        postCode: post.postCode,
        content: post.content,
        status: post.status,
        date: post.post_time,
        userCode: post.user.userCode,
        avatar: post.user.avatar,
        userName: post.user.userName,
        media: post.media,
      }));
      return {
        status: 200,
        posts,
        total,
      };
    } catch (error) {
      return {
        status: 404,
        message: error,
      };
    }
  }

  // lấy về các bài post của những người mà mình FOLLOW
  async findAll(start: number, userId: number) {
    const items_per_page = 2;
    const startIndex = (Number(start) - 1) * items_per_page;
    const endIndex = startIndex + items_per_page;
    // Lấy về id của những người mà mình theo dõi
    const findFollowbyUser = await this.followRepo
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.friend', 'friend')
      .where('follow.user.id = :userId', { userId })
      .getMany();
    const friendIds = findFollowbyUser.map((follow) => follow.friend.id);
    const userIdPost = [...friendIds, userId];
    // Lấy về bài post của những người mà mình theo dõi
    const [posts, total] = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.media', 'media')
      .where('post.user.id IN (:...userIdPost)', { userIdPost })
      .andWhere('post.status=:status', { status: 1 })
      .orderBy('post.id', 'DESC')
      .take(items_per_page)
      .skip(startIndex)
      .select([
        'user.id',
        'user.userCode',
        'user.avatar',
        'user.userName',
        'post',
        'media',
      ])
      .getManyAndCount();
    const lastPage = endIndex >= total;
    return {
      posts,
      lastPage,
    };
  }

  async findAllPost(start: number) {
    try {
      const items_per_page = 10;
      const startIndex = (Number(start) - 1) * items_per_page;
      const [allPosts, total] = await this.postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.media', 'media')
        .orderBy('post.id', 'DESC')
        .take(items_per_page)
        .skip(startIndex)
        .select([
          'user.id',
          'user.userCode',
          'user.avatar',
          'user.userName',
          'post',
          'media',
        ])
        .getManyAndCount();

      const posts = allPosts.map((post) => ({
        id: post.id,
        postCode: post.postCode,
        content: post.content,
        status: post.status,
        date: post.post_time,
        userCode: post.user.userCode,
        avatar: post.user.avatar,
        userName: post.user.userName,
        media: post.media,
        userId: post.user.id,
      }));
      return {
        status: 200,
        posts,
        total,
      };
    } catch (error) {
      return {
        status: 404,
        message: error,
      };
    }
  }

  async findOne(postCode: string) {
    const find = await this.postRepo.findOne({
      where: { postCode },
      relations: ['user', 'media'],
    });
    if (find) {
      const cmt = await this.cmtRepo.find({
        where: { post: { id: find.id } },
      });
      return {
        status: 200,
        post: find,
        cmtQuantity: cmt.length,
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }

  async findOnePost(id: number) {
    const find = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'media'],
    });
    if (find) {
      return {
        status: 200,
        post: find,
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }

  async findOneByCode(postCode: string) {
    const find = await this.postRepo.findOne({
      where: { postCode },
      relations: ['user', 'media'],
    });
    if (find) {
      const cmt = await this.cmtRepo.find({
        where: { post: { id: find.id } },
      });
      return {
        status: 200,
        post: find,
        cmt,
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }

  async findAllBelongUser(userCode: string) {
    const find = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.media', 'media')
      .leftJoinAndSelect('post.comment', 'comment')
      .leftJoinAndSelect('post.reactPost', 'reactPost')
      .leftJoinAndSelect('post.user', 'user')
      .where('user.userCode = :userCode', { userCode: userCode })
      .andWhere('post.status = :status', { status: 1 })
      .getMany();
    if (find) {
      return {
        status: 200,
        post: find,
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }
  async countPostQuantityOfMonth() {
    const postCount = await this.postRepo
      .createQueryBuilder('post')
      .select('DATE_FORMAT(post.post_time, "%Y-%m") as month')
      .addSelect('COUNT(post.id) as count')
      .groupBy('month')
      .orderBy('month')
      .getRawMany();

    const mediaCount = await this.postRepo
      .createQueryBuilder('post')
      .select('DATE_FORMAT(post.post_time, "%Y-%m") as month')
      .leftJoin('post.media', 'media')
      .addSelect(
        'SUM(CASE WHEN media.type = "image" THEN 1 ELSE 0 END) as imageCount',
      )
      .addSelect(
        'SUM(CASE WHEN media.type = "video" THEN 1 ELSE 0 END) as videoCount',
      )
      .groupBy('month')
      .orderBy('month')
      .getRawMany();
    const mergedData = postCount.map((postItem) => {
      const mediaItem = mediaCount.find(
        (media) => media.month === postItem.month,
      );
      return {
        month: postItem.month,
        postCount: postItem.count,
        imageCount: mediaItem ? mediaItem.imageCount : 0,
        videoCount: mediaItem ? mediaItem.videoCount : 0,
      };
    });
    return mergedData;
  }

  async update(updatePostDto: UpdatePostDto) {
    const { id, content } = updatePostDto;
    const post = await this.postRepo.findOne({ where: { id } });
    if (post) {
      post.content = content;
      await this.postRepo.save(post);
      return {
        status: 200,
        message: 'Update post successfully',
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }

  async updateStatus(postCode: string) {
    const post = await this.postRepo.findOne({ where: { postCode } });
    if (post) {
      if (post.status === 1) post.status = 0;
      else post.status = 1;
      await this.postRepo.save(post);
      return {
        status: 200,
        message: 'Update post successfully',
        postId: post.id,
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }

  async remove(postCode: string) {
    const find = await this.postRepo.findOne({
      where: { postCode },
    });
    if (find) {
      await this.postRepo.remove(find);
      return {
        status: 200,
        message: 'Post deleted successfully',
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }

  async findPostAll() {
    const find = await this.postRepo.find({
      relations: ['media', 'comment', 'reactPost', 'user'],
    });
    if (find) {
      return {
        status: 200,
        post: find,
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }
}
