import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MoreThan, Repository, SelectQueryBuilder } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserInfoDto } from './dto/update-info.dto';
import { Follow } from 'src/follow/entities/follow.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Follow) private followRepo: Repository<Follow>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, userName, fullName, password } = createUserDto;
      const find = await this.userRepo.findOne({
        where: { email: email },
      });
      if (!find) {
        const avatar =
          'https://firebasestorage.googleapis.com/v0/b/instagram-2e43f.appspot.com/o/media%2Favatar_default.jpg?alt=media&token=17eb258c-67e5-42e4-a353-643206eeb15a';
        const gender = 2;
        const hashPassword = await this.hashPasswordFunc(password);
        const status = 1;
        const newUser = this.userRepo.create({
          email,
          userName,
          fullName,
          password: hashPassword,
          avatar,
          gender,
          status,
        });
        await this.userRepo.save(newUser);
        return {
          status: 201,
          message: 'User created successfully',
        };
      } else {
        return {
          status: 401,
          message: 'User with this email already exists',
        };
      }
    } catch (error) {
      return {
        message: 'Something wrong when register',
      };
    }
  }

  private async hashPasswordFunc(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async findAllByRole(role: number, start: number) {
    try {
      const items_per_page = 10;
      const startIndex = (Number(start) - 1) * items_per_page;
      if (role >= 0) {
        const [users, total] = await this.userRepo
          .createQueryBuilder('user')
          .orderBy('date_join', 'DESC')
          .where('user.status=:role', { role })
          .take(items_per_page)
          .skip(startIndex)
          .select([
            'user.id',
            'user.userCode',
            'user.email',
            'user.userName',
            'user.fullName',
            'user.avatar',
            'user.date_join',
            'user.status',
          ])
          .getManyAndCount();
        return {
          status: 200,
          users,
          total,
        };
      } else {
        const [users, total] = await this.userRepo
          .createQueryBuilder('user')
          .orderBy('date_join', 'DESC')
          .take(items_per_page)
          .skip(startIndex)
          .select([
            'user.id',
            'user.userCode',
            'user.email',
            'user.userName',
            'user.fullName',
            'user.avatar',
            'user.date_join',
            'user.status',
          ])
          .getManyAndCount();
        return {
          status: 200,
          users,
          total,
        };
      }
    } catch (error) {
      return {
        status: 404,
        message: error,
      };
    }
  }

  countUserQuantityOfMonth() {
    return this.userRepo
      .createQueryBuilder('user')
      .select('DATE_FORMAT(user.date_join, "%Y-%m") as month')
      .addSelect('COUNT(user.id) as count')
      .groupBy('month')
      .orderBy('month')
      .getRawMany();
  }

  async search(query: string) {
    try {
      const keyword = query.toLowerCase();
      const [allUsers, total] = await this.userRepo
        .createQueryBuilder('user')
        .where(
          `LOWER(user.userName) LIKE :keyword OR user.email LIKE :keyword OR LOWER(user.fullName) LIKE :keyword`,
          {
            keyword: `%${keyword}%`,
          },
        )
        .getManyAndCount();
      const followersPromises = allUsers.map(async (user) => {
        const followers = await this.followRepo.find({
          where: { friend: { id: user.id }, status: MoreThan(0) },
        });
        return { ...user, follower: followers.length };
      });

      const users = await Promise.all(followersPromises);
      return {
        status: 200,
        users,
        total,
      };
    } catch (error) {
      return {
        status: 404,
        message: error,
      };
    }
  }

  async findOne(userCode: string) {
    return await this.userRepo.findOne({
      where: { userCode: userCode },
      select: [
        'id',
        'fullName',
        'userName',
        'date_join',
        'email',
        'userCode',
        'avatar',
        'bio',
      ],
    });
  }

  async updateInfo(updateUserDto: UpdateUserDto) {
    const { id, fullName, bio, gender, avatar } = updateUserDto;
    const user = await this.userRepo.findOne({ where: { id } });
    if (user) {
      user.fullName = fullName;
      user.bio = bio;
      user.gender = gender;
      user.avatar = avatar;
      await this.userRepo.save(user);
      return {
        status: 200,
        message: 'User Info Updated Successfully',
      };
    } else {
      return {
        status: 404,
        message: `User not found`,
      };
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { user_id, password, newPassword } = updatePasswordDto;
    const user = await this.userRepo.findOne({ where: { id: user_id } });
    if (user) {
      const checkPass = bcrypt.compareSync(password, user.password);
      if (!checkPass) {
        return {
          status: 400,
          message: 'Password is not correct',
        };
      } else {
        const hashPassword = await this.hashPasswordFunc(newPassword);
        user.password = hashPassword;
        await this.userRepo.save(user);
        return {
          status: 200,
          message: 'User updated successfully',
        };
      }
    } else {
      return {
        status: 404,
        message: 'User not found',
      };
    }
  }
  // ban
  async updateStatus(updateUserInfoDto: UpdateUserInfoDto) {
    const { userCode, admin_id, type } = updateUserInfoDto;
    const user = await this.userRepo.findOne({ where: { userCode } });
    const admin = await this.userRepo.findOne({ where: { id: admin_id } });
    if (user && admin) {
      if (admin.status < 2) {
        return {
          status: 404,
          message: 'Admin has not permissions to perform this action',
        };
      } else {
        if (type === 'ban') {
          if (user.status >= 1 && admin.status > user.status) {
            user.status = 0;
          } else if (user.status === 0) {
            user.status = 1;
          }
        } else if (type === 'mod') {
          if (user.status === 1 && admin.status > user.status) {
            user.status = 2;
          } else if (user.status === 2 && admin.status > user.status) {
            user.status = 1;
          }
        }
        await this.userRepo.save(user);
        return {
          status: 200,
          message: 'Update status successfully',
        };
      }
    } else {
      return {
        status: 404,
        message: 'User not found',
      };
    }
  }
}
