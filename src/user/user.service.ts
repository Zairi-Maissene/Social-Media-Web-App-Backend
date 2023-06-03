import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {FindOptionsWhere, Repository} from 'typeorm';
import { FriendRequest } from '../friend-request/entities/friend-request.entity';
import { SubscribeUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from '../interfaces/payload.interface';
import { ReusableService } from '../reusable/reusable.service';
import * as dotenv from 'dotenv';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';

dotenv.config();

@Injectable()
export class UserService extends ReusableService<User> {
  notFoundMessage = 'User not found';

  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      @InjectRepository(FriendRequest)
      private friendRequestRepository: Repository<FriendRequest>,
    private jwtService: JwtService,
  ) {
    super(userRepository);
  }

  getALLUsers() {
    return super.findAll();
  }

  async findUser(id: string, userId: string) {
    const searchedUser = await super.findById(id);
    const response = {
      userFriendship: null,
      user: searchedUser,
    };
    if (userId !== undefined) {
      response.userFriendship = 'notFriend';

      if (id === userId) {
        const userFriendship = 'admin';

        response.userFriendship = userFriendship;
        return response;
      }

      if ((await this.isAFriend(userId, id)) === true) {
        const userFriendship = 'friend';
        response.userFriendship = userFriendship;
        return response;
      }

      if (
        await this.friendRequestRepository.findOne({
          where: { reciever: { id: userId }, sender: { id: id } },
        })
      ) {
        const userFriendship = 'recievedRequest';
        response.userFriendship = userFriendship;
        return response;
      }
      const test = await this.friendRequestRepository.findOne({
        where: [{ reciever: { id: id }, sender: { id: userId } }],
      });

      if (test) {
        const userFriendship = 'sentRequest';
        console.log('test:', test);
        response.userFriendship = userFriendship;
        return response;
      }
    }
    return response;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await super.update(id, updateUserDto);
  }

  async delete(id: string) {
    return super.softDelete(id, this.notFoundMessage);
  }
  async getAllRequests(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    if (!user) {
      throw new NotFoundException(this.notFoundMessage);
    }

    return user.friends;
  }

  async getFriends(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.friends', 'friend')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!user) {
      throw new NotFoundException(this.notFoundMessage);
    }

    return user.friends;
  }

  async searchByName(name: string) {
    return await this.userRepository.findOne({ where: { username: name } });
  }
  async getPosts(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'post')
      .select(['user.id', 'user.username', 'post.id', 'post.content'])
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException(this.notFoundMessage);
    }

    return user;
  }

  async subscribe(userInfo: SubscribeUser): Promise<any> {
    const existingUsername = await this.searchByName(userInfo.username);
    const password = await bcrypt.hash(
      userInfo.password,
      process.env.GLOBAL_SALT,
    );
    const user = await this.userRepository.create({ ...userInfo, password });

    try {
      await this.userRepository.save(user);
    } catch (err) {
      if (existingUsername) {
        throw new ConflictException('Username must be unique');
      } else {
        throw new ConflictException(' Email must be unique');
      }
    }
    return user;
  }

  async login(credentials: LoginDto) {
    const { login, password } = credentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where(
        'user.userName =:login or user.email=:login or user.phoneNumber=:login',
        { login },
      )
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found ');
    }
    const hashedPassword = await bcrypt.hash(password, process.env.GLOBAL_SALT);

    if (user.password === hashedPassword) {
      const playload: PayloadInterface = {
        userName: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      };
      const jwt = await this.jwtService.sign(playload);
      console.log(user);
      delete user.password;
      return {
        access_token: jwt,
        user: user,
      };
    } else throw new NotFoundException('Password is incorrect');
  }
  async Unfollow(userId: string, friendId: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder()
        .delete()
        .from('friends')
        .where(
          '(user1 = :userId AND user2 = :friendId) OR (user1 = :friendId AND user2 = :userId)',
          { userId, friendId },
        )
        .execute();
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // Handle specific database query errors
        throw new Error('Failed to delete friend from the friends table');
      } else {
        // Handle other unexpected errors
        throw error;
      }
    }
  }
  async isAFriend(userId: string, friendId: string) {
    const friends=await this.getFriends(userId);

return friends?.filter((friend)=>friend.id===friendId).length>0;
  }
  async nonFriendsUsers(userId,page:number) {
    console.log("page-1",page-1)
    console.log("page",page)
    const pageSize = 8;
    const user = await this.userRepository
        .createQueryBuilder('user')
        .where(
            'user.id =:userId',
            {userId},
        )
        .getOne();
    if (!user) {
      throw new NotFoundException('User not found ');
    }

    const friends = await this.getFriends(userId);
    const allUsers = await this.getALLUsers();
    const potentielFriends = await this.getPotentialFriends(userId);

    const users = await allUsers.filter(
        (user) =>
            !friends.map((friend) => friend.id).includes(user.id) &&
            !potentielFriends.map((friend) => friend.id).includes(user.id) &&
            user.id !== userId,
    );
    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / pageSize);

    const startIndex = (page-1) * pageSize;
    const endIndex = page * pageSize;

    const paginatedUsers = users.slice(startIndex>=0 ? startIndex : 0, endIndex);

    return {
      users: paginatedUsers,
      totalPages,
    };
  }

  async getPotentialFriends(userId) {
    const potentialFriends: User[] = [];
    let friendRequests = await this.friendRequestRepository.find({
      relations: {
        sender: true,
        reciever: true,
      },
    });
    if (friendRequests) {
      friendRequests = friendRequests.filter(
        (request) => request.sender.id == userId,
      );
      friendRequests.forEach((request) =>
        potentialFriends.push(request.reciever),
      );
    }
    return potentialFriends;
  }
}
