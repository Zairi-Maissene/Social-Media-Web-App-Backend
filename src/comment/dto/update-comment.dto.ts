import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { UpdateReusableDto } from 'src/reusable/dto/update-reusable.dto';

export class UpdateCommentDto extends UpdateReusableDto {
    content :String ;
}
