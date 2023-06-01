import { IsNotEmpty } from 'class-validator';
import { CreateReusableDto } from 'src/reusable/dto/create-reusable.dto';
import { User } from 'src/user/entities/user.entity';
import { IsNull } from 'typeorm';

export class CreatePostDto extends CreateReusableDto {
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  imageUrl: string;
  @IsNotEmpty()
  owner: User;
}
