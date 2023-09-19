import { Injectable } from '@nestjs/common';
import { CreateAccessLogDto } from './dto/create-access-log.dto';
import { UpdateAccessLogDto } from './dto/update-access-log.dto';
import { AccessLog } from './entities/access-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccessLogService {
  constructor(
    @InjectRepository(AccessLog) private accessRepo: Repository<AccessLog>,
  ) {}
  async create(createAccessLogDto: CreateAccessLogDto) {
    const { month } = createAccessLogDto;
    const find = await this.accessRepo.findOne({ where: { month } });
    if (find) {
      const newViews = find.views + 1;
      find.views = newViews;
      await this.accessRepo.save(find);
      return {
        status: 200,
        message: 'Access Log updated successfully',
      };
    } else {
      const newView = {
        views: 1,
        month,
      };
      await this.accessRepo.save(newView);
      return {
        status: 201,
        message: 'Access Log of new month created successfully',
      };
    }
  }

  async findAll() {
    const allAccessLog = await this.accessRepo.find();
    if (allAccessLog && allAccessLog.length > 0) {
      return allAccessLog;
    } else {
      return {
        status: 404,
        message: 'Have no Access Log',
      };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} accessLog`;
  }

  update(id: number, updateAccessLogDto: UpdateAccessLogDto) {
    return `This action updates a #${id} accessLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} accessLog`;
  }
}
