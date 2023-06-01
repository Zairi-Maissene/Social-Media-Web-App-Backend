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
import { User } from '../decorators/user.decorator';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createFriendRequestDto: CreateFriendRequestDto, @User() user) {
    return this.friendRequestService.create(createFriendRequestDto, user);
  }
  @Patch(':requestId')
  @UseGuards(JwtAuthGuard)
  acceptRequest(@Param('requestId') requestId: string, @User() user) {
    return this.friendRequestService.acceptRequest(requestId, user);
  }

  @Get('sent')
  @UseGuards(JwtAuthGuard)
  findAllSent(@User() user) {
    return this.friendRequestService.getAllSent(user.id);
  }
  @Get('recieved')
  @UseGuards(JwtAuthGuard)
  findAllRecieved(@User() user) {
    return this.friendRequestService.getAllRecieved(user.id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendRequestService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @User() user) {
    return this.friendRequestService.refuse(id, user);
  }
}
