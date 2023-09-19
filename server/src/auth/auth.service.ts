import {
  BadRequestException,
  HttpException,
  Injectable,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { NotFoundError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { log } from 'console';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(signInDto: CreateAuthDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: signInDto.email },
      });
      const checkPass = bcrypt.compareSync(signInDto.password, user.password);
      if (!checkPass) {
        return {
          status: 400,
          message: 'Email or Password is not correct',
        };
      }
      //generate access token
      const payload = { id: user.id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);
      return { status: 200, user, access_token };
    } catch (error) {
      return {
        status: 400,
        message: 'Email or Password is not correct',
      };
    }
  }

  async getProfile(token: string) {
    try {
      const decoded: any = jwt.verify(
        token,
        this.configService.get<string>('SECRET'),
      );
      const user = await this.userRepo.findOne({ where: { id: decoded?.id } });
      const payload = { id: user.id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);
      return {
        status: 200,
        user,
        access_token,
      };
    } catch (error) {
      // Xử lý lỗi khi token không hợp lệ
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
