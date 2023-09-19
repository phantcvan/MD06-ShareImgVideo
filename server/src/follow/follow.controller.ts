import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';

@Controller('v1/follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  create(@Body() createFollowDto: CreateFollowDto) {
    return this.followService.create(createFollowDto);
  }

  @Get('suggest/:id')
  suggest(@Param('id') id: string) {
    return this.followService.suggest(+id);
  }
// kiểm tra xem userId có follow friend_id hay không
  @Get('check/:user_id/:friend_id')
  findOne(
    @Param('user_id') user_id: string,
    @Param('friend_id') friend_id: string,
  ) {
    return this.followService.findOne(+user_id, +friend_id);
  }

  // trả về danh sách những người theo dõi user_id
  @Get('find/follower/:userCode')
  findFollower(@Param('userCode') userCode: string) {
    return this.followService.findFollower(userCode);
  }

  // trả về danh sách những người mà user_id đang theo dõi
  @Get('find/following/:userCode')
  findFollowing(@Param('userCode') userCode: string) {
    return this.followService.findFollowing(userCode);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
    return this.followService.update(+id, updateFollowDto);
  }

  @Delete(':user_id/:friend_id')
  remove(
    @Param('user_id') user_id: string,
    @Param('friend_id') friend_id: string,
  ) {
    return this.followService.remove(+user_id, +friend_id);
  }
}
