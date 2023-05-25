import {ConflictException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from '../friend-request/entities/friend-request.entity';
import { SubscribeUser} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
           private userRepository: Repository<User>
  ) {}



  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async getAllRequests(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    return user.friends;
  }
  async getALLUsers():Promise<User[]> {
    return await this.userRepository.find();
  }
  async subscribe(userInfo: SubscribeUser): Promise<User>
  {

    const user = this.userRepository.create({...userInfo})
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password,user.salt)
    try {
      await this.userRepository.save(user);
    }
    catch (err) {
      throw new ConflictException("username and email doivent etre uniques")
    }
    delete user.password;
    delete user.salt;
    return user ;
  }
}
