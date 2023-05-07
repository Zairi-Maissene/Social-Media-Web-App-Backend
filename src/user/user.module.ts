import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from '../friend-request/entities/friend-request.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
