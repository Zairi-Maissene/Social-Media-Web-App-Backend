import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { FriendRequest } from './entities/friend-request.entity';
import {Reusable} from "../reusable/entities/reusable.entity";
import {ReusableService} from "../reusable/reusable.service";

@Injectable()
export class FriendRequestService extends ReusableService<FriendRequest> {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestEntityRepository: Repository<FriendRequest>,
    @InjectRepository(User) private userEntityRepository: Repository<User>,
  ) {
    super (friendRequestEntityRepository)
  }
  async create(createFriendRequestDto: CreateFriendRequestDto) {


    return await super.create(createFriendRequestDto);

  }
  async refuse(userid: string, user: string) {
    const request = await this.friendRequestEntityRepository.findOne({
      where: [
        { reciever: { id: userid || user } },
        { sender: { id: userid || user } },
      ],
    });

    if (!request) {
      throw new NotFoundException("Request doesn't exist anymore.");
    } else {
      console.log(request);
        return await this.friendRequestEntityRepository.delete(request.id);


    }


  }
  async acceptRequest(requestId: string, user: User) {
    const request = await this.friendRequestEntityRepository.findOne({
      where: { id: requestId },
      relations: {
        reciever: true,
        sender: true,
      },
    });
    if (!request) {
      throw new NotFoundException("Request doesn't exist anymore.");
    }
    if (request.reciever.id !== user.id) {
      throw new ForbiddenException();
    }
    const userWithFriends = await this.userEntityRepository.findOne({
      where: { id: user.id },
      relations: ['friends'],
    });
    console.log(userWithFriends);
    const newFriends = userWithFriends.friends || [];
    newFriends.push(request.sender);
    await this.friendRequestEntityRepository.delete(requestId);
    const newUser = { ...user, friends: newFriends };
    await this.userEntityRepository.save(newUser);
  }

  async getAllRecieved(userId: string) {
    console.log(userId);
    const user = await this.userEntityRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Cannot find user with the specified id.');
    }
    const userRequests = await this.friendRequestEntityRepository.find({
      where: { reciever: { id: userId } },
    });
    if (!userRequests) {
      return [];
    }
    const response = userRequests.map((request) => ({
      sender: request.sender,
      requestId: request.id,
      requestDate: request.createdAt,
    }));
    return response;
  }
  async getAllSent(userId: string) {
    console.log(userId);
    const user = await this.userEntityRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Cannot find user with the specified id.');
    }
    const userRequests = await this.friendRequestEntityRepository.find();
    const sentRequests = [];
    userRequests.forEach((e) => {
      if (e.sender.id == user.id) {
        sentRequests.push(e);
      }
    });
    console.log(sentRequests.length);
    const response = sentRequests.map((request) => request.reciever)
    return response;
  }

  async findOne(id: string) {
    return await this.friendRequestEntityRepository.findOneBy({
      id: id,
    });
  }
}
