import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserInfoDto } from './dto/update-info.dto';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('all-user/:role/:start')
  findAllByRole(@Param('role') role: string, @Param('start') start: string) {
    return this.userService.findAllByRole(+role, +start);
  }

  @UseGuards(AuthGuard)
  @Get('all/by-month')
  countUserQuantityOfMonth() {
    return this.userService.countUserQuantityOfMonth();
  }

  @Get(':userCode')
  findOne(@Param('userCode') userCode: string) {
    return this.userService.findOne(userCode);
  }

  @UseGuards(AuthGuard)
  @Get('find-user/search')
  search(@Query('q') keyword: string) {
    return this.userService.search(keyword);
  }

  @UseGuards(AuthGuard)
  @Put('update/info')
  updateInfo(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateInfo(updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/status')
  updateStatus(@Body() updateUserInfoDto: UpdateUserInfoDto) {
    return this.userService.updateStatus(updateUserInfoDto);
  }
}
