import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateAccessLogDto } from '../dto/create-access-log.dto';

@Entity()
export class AccessLog {
  constructor(createAccessLogDto: CreateAccessLogDto) {
    Object.assign(this, createAccessLogDto);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  views: number;

  @Column()
  month: string;
}
