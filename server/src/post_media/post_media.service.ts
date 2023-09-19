import { Injectable } from '@nestjs/common';
import { CreatePostMediaDto } from './dto/create-post_media.dto';
import { UpdatePostMediaDto } from './dto/update-post_media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostMedia } from './entities/post_media.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class PostMediaService {
  constructor(
    @InjectRepository(PostMedia) private mediaRepo: Repository<PostMedia>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  async create(createPostMediaDto: CreatePostMediaDto) {
    const { type, mediaUrl, post_id } = createPostMediaDto;
    const post = await this.postRepo.findOne({ where: { id: post_id } });
    if (post) {
      const newMedia = {
        type,
        mediaUrl,
        post,
      };
      await this.mediaRepo.save(newMedia);
      return {
        status: 201,
        message: 'Media Successfully Added',
      };
    } else {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
  }

  findAll() {
    return `This action returns all postMedia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postMedia`;
  }

  update(id: number, updatePostMediaDto: UpdatePostMediaDto) {
    return `This action updates a #${id} postMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} postMedia`;
  }
}
