import { PartialType } from '@nestjs/swagger';
import { CreateReactCmtDto } from './create-react-cmt.dto';

export class UpdateReactCmtDto extends PartialType(CreateReactCmtDto) {}
