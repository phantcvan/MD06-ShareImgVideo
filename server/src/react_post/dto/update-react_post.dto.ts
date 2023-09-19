import { PartialType } from '@nestjs/swagger';
import { CreateReactPostDto } from './create-react_post.dto';

export class UpdateReactPostDto extends PartialType(CreateReactPostDto) {}
