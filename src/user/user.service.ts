import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from '../friend-request/entities/friend-request.entity';
import { SubscribeUser} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {LoginDto} from "./dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
           private userRepository: Repository<User>,
      private jwtService: JwtService
  ) {}



  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    // return this.userEntityRepository.findOne(id);
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
async login (credentials : LoginDto){
    const {login, password} = credentials;

    console.log(credentials)
    const user = await this.userRepository.createQueryBuilder("user")
        .where("user.userName =:login or user.email=:login or user.phoneNumber=:login",{login})
        .getOne();
    if(!user){
      throw new NotFoundException("login  erronée ")
    }
  const hashedPassword = await bcrypt.hash(password,user.salt);
    if (user.password === hashedPassword)
    { const playload = {"username":user.username, "email":user.email,"phone Number":user.phoneNumber}
      const jwt = await this.jwtService.sign(playload);

      return {
        "access_token": jwt
      };
    }
    else
      throw new NotFoundException("Password  erronée ")

}

}
