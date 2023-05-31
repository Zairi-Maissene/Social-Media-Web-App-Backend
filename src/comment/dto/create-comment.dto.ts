import { CreateReusableDto } from 'src/reusable/dto/create-reusable.dto';
import { User } from 'src/user/entities/user.entity';

export class CreateCommentDto extends CreateReusableDto {
  content: string;
  postId: string;
  writer: User;
}
