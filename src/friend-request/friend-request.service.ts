import { NotFoundException } from '@nestjs/common';
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
  async create(createFriendRequestDto: CreateFriendRequestDto) {
    const users = await this.userEntityRepository.find({ take: 2 });
    const friendRequest = new FriendRequest();
    friendRequest.sender = users[0];
    friendRequest.reciever = users[1];
    return await this.friendRequestEntityRepository.save(friendRequest);
  }

  async acceptRequest(requestId: string) {
    const users = await this.userEntityRepository.find({
      take: 2,
      relations: ['friends'],
    });
    const request = await this.friendRequestEntityRepository.findOneBy({
      id: requestId,
    });
    if (!request) {
      throw new NotFoundException();
    }

    if (request.reciever.id !== users[1].id) {
      throw new ForbiddenException();
    }
    console.log(users[1]);
    const newFriends = [...users[1].friends, request.sender];
    const newUser = { ...users[1], friends: newFriends };
    await this.userEntityRepository.save(newUser);
  }
  async getAll(userId: string) {
    console.log(userId);
    const user = await this.userEntityRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Cannot find user with the specified id.');
    }
    const userRequests = await this.friendRequestEntityRepository.findBy({

    // reciever :user,
      
    });
    const response = userRequests.map((request) => request.sender);
    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} friendRequest`;
  }

  update(id: number, updateFriendRequestDto: UpdateFriendRequestDto) {
    return `This action updates a #${id} friendRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} friendRequest`;
  }
}
