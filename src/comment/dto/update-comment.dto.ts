import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { UpdateReusableDto } from 'src/reusable/dto/update-reusable.dto';
import { IsNotEmpty } from "class-validator";

export class UpdateCommentDto extends UpdateReusableDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  content: string;
}
