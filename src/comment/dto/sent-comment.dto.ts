import { CreateReusableDto } from 'src/reusable/dto/create-reusable.dto';
import { User } from 'src/user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class SentCommentDto extends CreateReusableDto {
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  postId: string;
  @IsNotEmpty()
  writer: User;
}
