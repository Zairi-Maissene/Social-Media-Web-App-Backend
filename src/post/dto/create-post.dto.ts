import { IsNotEmpty } from 'class-validator';
import { CreateReusableDto } from 'src/reusable/dto/create-reusable.dto';
import { User } from 'src/user/entities/user.entity';

export class CreatePostDto extends CreateReusableDto {
  content: string;
  imageUrl: string;
  owner: User;
}
