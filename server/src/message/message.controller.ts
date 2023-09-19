import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('v1/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get('last/:converCode/:userId')
  getLastMess(
    @Param('converCode') converCode: string,
    @Param('userId') userId: string,
  ) {
    return this.messageService.getLastMess(converCode, +userId);
  }

  @Get('group/:converCode/:userId')
  findAllBelongGroup(
    @Param('converCode') converCode: string,
    @Param('userId') userId: string,
  ) {
    return this.messageService.findAllBelongGroup(converCode, userId);
  }

  @Patch(':groupCode/:userId')
  update(
    @Param('groupCode') groupCode: string,
    @Param('userId') userId: string,
  ) {
    return this.messageService.update(groupCode, userId);
  }

  @Delete(':groupCode')
  remove(@Param('groupCode') groupCode: string) {
    return this.messageService.remove(groupCode);
  }
}
