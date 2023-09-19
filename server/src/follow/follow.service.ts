import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { MoreThan, Not, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private followRepo: Repository<Follow>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async create(createFollowDto: CreateFollowDto) {
    const { user_id, friend_id, status } = createFollowDto;
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    const friend = await this.userRepo.findOne({ where: { id: friend_id } });
    if (user && friend) {
      const newFollow = {
        user,
        friend,
        status,
      };
      await this.followRepo.save(newFollow);
      return {
        status: 201,
        message: 'Follow Successfully Added',
      };
    } else {
      return {
        status: 404,
        message: 'User not found',
      };
    }
  }

  async suggest(userId) {
    // lấy về tất cả người dùng mà mình chưa follow
    const usersFollowed = await this.followRepo.find({
      where: { user: { id: userId } },
      relations: ['friend'],
    });
    let usersNotFollowed = [];
    if (usersFollowed.length > 0) {
      const userIdsFollowed = usersFollowed.map((follow) => follow.friend.id);
      usersNotFollowed = await this.userRepo
        .createQueryBuilder('user')
        .where('user.id != :userId', { userId })
        .andWhere('user.id NOT IN (:...userIdsFollowed)', { userIdsFollowed })
        .getMany();
    } else {
      usersNotFollowed = await this.userRepo.find();
    }
    const usersFilter = usersNotFollowed.filter((user) => user.id !== 20);
    function getRandomUsers(users, count) {
      const shuffled = users.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
    const suggest = getRandomUsers(usersFilter, 5);
    return suggest;
  }

  async findOne(id: number, friend_id: number) {
    const find = await this.followRepo.findOne({
      where: {
        user: { id: id },
        friend: { id: friend_id },
      },
    });
    if (find && find.status > 0) {
      return {
        status: 200,
        find,
      };
    } else {
      return {
        status: 404,
        message: 'Not Follow',
      };
    }
  }

  // trả về danh sách những người theo dõi user_id
  async findFollower(userCode: string) {
    try {
      const follower = await this.followRepo.find({
        where: { friend: { userCode }, status: MoreThan(0) },
        relations: ['user'],
      });
      return {
        status: 200,
        follower,
      };
    } catch (error) {
      return {
        status: 404,
        message: error,
      };
    }
  }

  // trả về danh sách những người mà user_id đang theo dõi
  async findFollowing(userCode: string) {
    try {
      const following = await this.followRepo.find({
        where: { user: { userCode }, status: MoreThan(0) },
        relations: ['friend'],
      });
      return {
        status: 200,
        following,
      };
    } catch (error) {
      return {
        status: 404,
        message: error,
      };
    }
  }

  update(id: number, updateFollowDto: UpdateFollowDto) {
    return `This action updates a #${id} follow`;
  }

  async remove(user_id: number, friend_id: number) {
    const find = await this.followRepo.findOne({
      where: {
        user: { id: user_id },
        friend: { id: friend_id },
      },
    });
    if (find) {
      await this.followRepo.remove(find);
      return {
        status: 200,
        message: 'Unfollow successfully',
      };
    } else {
      return {
        status: 404,
        message: 'Follow not found',
      };
    }
  }
}
