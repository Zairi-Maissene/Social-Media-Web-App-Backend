import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { FriendRequest } from '../friend-request/entities/friend-request.entity';
import { Post } from '../post/entities/post.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { ConfigService } from '@nestjs/config';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, User, Post, Comment]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, ConfigService],
})
export class UserModule {}
