import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { FriendRequest } from 'src/friend-request/entities/friend-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment,FriendRequest])
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
