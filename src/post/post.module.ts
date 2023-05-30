import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { Post } from './entities/post.entity';
import { FriendRequest } from '../friend-request/entities/friend-request.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';




@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment,FriendRequest]),
  MulterModule.register({
    storage: diskStorage({
      destination: function (req, file, cb) {
        cb(null, './postUploads');
      },
      filename: function (req, file, cb) {
        const name = file.originalname;
        cb(null, `${name}`);
      }
  })})
],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
