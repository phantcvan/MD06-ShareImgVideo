import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('v1/noti')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findAllBelongUser(@Param('id') id: string) {
    return this.notificationService.findAllBelongUser(+id);
  }

  @UseGuards(AuthGuard)
  @Get('count/:id')
  countNoti(@Param('id') id: string) {
    return this.notificationService.countNoti(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string) {
    return this.notificationService.update(+id);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Body() deleteNotificationDto: CreateNotificationDto) {
    return this.notificationService.remove(deleteNotificationDto);
  }
}
