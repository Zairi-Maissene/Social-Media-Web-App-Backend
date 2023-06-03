import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { JwtAuthGuard } from '../user/Guards/jwt-auth.guard';
import { User as UserDeco } from '../decorators/user.decorator';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  createFriendRequest(@Body('recieverId') reciverId: string, @UserDeco() user) {
    const createFriendRequestDto: CreateFriendRequestDto = {
      reciever: reciverId,
      sender: user.id,
    };
    console.log('reciever', reciverId);
    return this.friendRequestService.create(createFriendRequestDto, user);
  }
  @Patch('accept/:requestId')
  @UseGuards(JwtAuthGuard)
  acceptFriendRequest(@Param('requestId') requestId: string, @UserDeco() user) {
    return this.friendRequestService.acceptRequest(requestId, user);
  }
  @Get('sent')
  @UseGuards(JwtAuthGuard)
  findAllSentFriendRequest(@UserDeco() user) {
    return this.friendRequestService.getAllSent(user.id);
  }
  @Get('recieved')
  @UseGuards(JwtAuthGuard)
  findAllRecievedFriendRequest(@UserDeco() user) {
    return this.friendRequestService.getAllRecieved(user.id);
  }
  @Get('/findone/:id')
  findFriendRequest(@Param('id') id: string) {
    return this.friendRequestService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  RemoveFriendRequest(@Param('id') id: string, @UserDeco() user) {
    return this.friendRequestService.refuse(id, user.id);
  }
}
