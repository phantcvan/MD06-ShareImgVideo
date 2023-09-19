import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @UseGuards(AuthGuard)
  @Get('all/:start/:userId')
  findAll(@Param('start') start: string, @Param('userId') userId: string) {
    return this.postService.findAll(+start, +userId);
  }

  @UseGuards(AuthGuard)
  @Get('all-post/:start')
  findAllPost(@Param('start') start: string) {
    return this.postService.findAllPost(+start);
  }

  @UseGuards(AuthGuard)
  @Get('one-post/:id')
  findOnePost(@Param('id') id: string) {
    return this.postService.findOnePost(+id);
  }

  @UseGuards(AuthGuard)
  @Get('post-all')
  findPostAll() {
    return this.postService.findPostAll();
  }

  @UseGuards(AuthGuard)
  @Get('find-post/search/:start')
  search(@Param('start') start: string, @Query('q') keyword: string) {
    return this.postService.search(+start, keyword);
  }

  @UseGuards(AuthGuard)
  @Get('all/by-month')
  countPostQuantityOfMonth() {
    return this.postService.countPostQuantityOfMonth();
  }

  @UseGuards(AuthGuard)
  @Get('profile/:userCode')
  findAllBelongUser(@Param('userCode') userCode: string) {
    return this.postService.findAllBelongUser(userCode);
  }

  @UseGuards(AuthGuard)
  @Get('get-one/:postCode')
  findOneByCode(@Param('postCode') postCode: string) {
    return this.postService.findOneByCode(postCode);
  }

  @UseGuards(AuthGuard)
  @Get(':postCode')
  findOne(@Param('postCode') postCode: string) {
    return this.postService.findOne(postCode);
  }

  @UseGuards(AuthGuard)
  @Put('/update/content')
  update(@Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(updatePostDto);
  }
  @UseGuards(AuthGuard)
  @Put('/update/status/:code')
  updateStatus(@Param('code') code: string) {
    return this.postService.updateStatus(code);
  }

  @UseGuards(AuthGuard)
  @Delete(':postCode')
  remove(@Param('postCode') postCode: string) {
    return this.postService.remove(postCode);
  }
}
