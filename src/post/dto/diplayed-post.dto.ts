import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Post } from '../entities/post.entity';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DisplayedPostDto extends Post {
  @IsNotEmpty()
  numberOfLikes: number;
  @IsNotEmpty()
  numberOfComments: number;
  @IsNotEmpty()
  isLiked: boolean;
}
