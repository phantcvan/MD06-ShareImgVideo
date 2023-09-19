import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReactPostService } from './react_post.service';
import { CreateReactPostDto } from './dto/create-react_post.dto';
import { UpdateReactPostDto } from './dto/update-react_post.dto';

@Controller('v1/react-post')
export class ReactPostController {
  constructor(private readonly reactPostService: ReactPostService) {}

  @Post()
  create(@Body() createReactPostDto: CreateReactPostDto) {
    return this.reactPostService.create(createReactPostDto);
  }

  @Get(':postCode')
  findAllBelongPost(@Param('postCode') postCode: string) {
    return this.reactPostService.findAllBelongPost(postCode);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reactPostService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReactPostDto: UpdateReactPostDto,
  ) {
    return this.reactPostService.update(+id, updateReactPostDto);
  }

  @Delete(':postId/:userId')
  remove(@Param('userId') userId: string, @Param('postId') postId: string) {
    return this.reactPostService.remove(+userId, +postId);
  }
}
