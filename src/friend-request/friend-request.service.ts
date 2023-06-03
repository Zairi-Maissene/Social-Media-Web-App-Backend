import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { FriendRequest } from './entities/friend-request.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestEntityRepository: Repository<FriendRequest>,
    @InjectRepository(User) private userEntityRepository: Repository<User>,
  ) {}
  async create(createFriendRequestDto: CreateFriendRequestDto, user: User) {
    const reciever = await this.userEntityRepository.findOneBy({
      id: createFriendRequestDto.reciever,
    });

    const request = await this.friendRequestEntityRepository.findOne({
      where: [{ reciever: { id: reciever.id } }],
    });

    if (!request) {
      const friendRequest = new FriendRequest();
      friendRequest.sender = user;
      friendRequest.reciever = reciever;
      return await this.friendRequestEntityRepository.save(friendRequest);
    } else return;
  }

  async refuse(userid: string, user: string) {
    const request = await this.friendRequestEntityRepository.findOne({
      where: [
        { reciever: { id: userid } ,
        sender: { id: user} },
        { reciever: { id: user } ,
          sender: { id: userid } },
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
      throw new NotFoundException();
    }

    const recieverWithFriends = await this.userEntityRepository.findOne({
      where: { id: user.id },
      relations: ['friends'],
    });
    const senderWithFriends = await this.userEntityRepository.findOne({
      where: { id: request.sender.id },
      relations: ['friends'],
    });
    console.log(recieverWithFriends);

    const newRecieverFriends = [...(recieverWithFriends.friends || []),request.sender];

    const newSenderFriends = [...(senderWithFriends.friends || []),request.reciever];

    await this.friendRequestEntityRepository.delete(requestId);
    const newReciever = { ...recieverWithFriends, friends: newRecieverFriends };
    const newSender = { ...senderWithFriends, friends: newSenderFriends };

    await this.userEntityRepository.save(newReciever);
    await this.userEntityRepository.save(newSender);
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
    const userRequests = await this.friendRequestEntityRepository.find({
      where: { sender: { id: userId } },
    });
    if (!userRequests) {
      return [];
    }
    const sentRequests = userRequests.map((request) => ({
      reciever: request.reciever,
      requestId: request.id,
      requestDate: request.createdAt,
    }));

    return sentRequests;
  }

  async findOne(id: string) {
    return await this.friendRequestEntityRepository.findOneBy({
      id: id,
    });
  }
}
