import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReactCmtService } from './react-cmt.service';
import { CreateReactCmtDto } from './dto/create-react-cmt.dto';
import { UpdateReactCmtDto } from './dto/update-react-cmt.dto';

@Controller('v1/react-cmt')
export class ReactCmtController {
  constructor(private readonly reactCmtService: ReactCmtService) {}

  @Post()
  create(@Body() createReactCmtDto: CreateReactCmtDto) {
    return this.reactCmtService.create(createReactCmtDto);
  }

  @Get(':id')
  findAllBelongCmt(@Param('id') id: string) {
    return this.reactCmtService.findAllBelongCmt(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReactCmtDto: UpdateReactCmtDto,
  ) {
    return this.reactCmtService.update(+id, updateReactCmtDto);
  }

  @Delete(':cmtId/:userId')
  remove(@Param('userId') userId: string, @Param('cmtId') cmtId: string) {
    return this.reactCmtService.remove(+userId, +cmtId);
  }
}
