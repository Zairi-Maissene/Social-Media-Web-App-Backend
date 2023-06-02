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
import { UserService } from './user.service';
import { SubscribeUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { SignupValidationPipe } from '../Pipes/SignupValidationPipe';
import { UpdateUserValidationPipe } from '../Pipes/UpdateUserValidationPipe';
import { UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from './Guards/jwt-auth.guard';
import { User as UserDeco } from '../decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: SubscribeUser): Promise<User> {
    console.log(createUserDto);
    return this.userService.subscribe(createUserDto);
  }
  @Post('/login')
  login(@Body() credentials: LoginDto) {
    return this.userService.login(credentials);
  }

  @Get()
  findAll() {
    return this.userService.getALLUsers();
  }

  @Get('/findone/:id/:connectedUserId?')
  findOne(@Param('id') id: string, @Param('connectedUserId') connectedUserId: string) {
    return this.userService.findUser(id, connectedUserId);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Body() updateUserDto: UpdateUserDto, @UserDeco() user) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@UserDeco() user) {
    return this.userService.delete(user.id);
  }
  @Get('/friends/:id')
  async getAllFriends(@Param('id') id: string) {
    return this.userService.getFriends(id);
  }
  @Get('/posts/:id')
  async getAllPosts(@Param('id') id: string) {
    return this.userService.getPosts(id);
  }
  @Get('/findbyname/:name')
  findByUserName(@Param('name') name: string) {
    return this.userService.searchByName(name);
  }
  @Delete('friend/removefriend/:friendid')
  @UseGuards(JwtAuthGuard)
  UnfollowFriend(
    @Param('friendid') friendid: string,
    @UserDeco() user,
  ) {
    return this.userService.Unfollow(friendid, user.id);
  }
  @Get('/friend/isafriend/:userid/:friendid')
  IsAFriend(
    @Param('friendid') friendid: string,
    @Param('userid') userid: string,
    @UserDeco() user,
  ) {
    return this.userService.isAFriend(userid, friendid);
  }

  @Get('/friends')
  @UseGuards(JwtAuthGuard)
  async getFriends(@UserDeco() user) {
    return await this.userService.getFriends(user.id);
  }
  @Get('/non-friends-users')
  @UseGuards(JwtAuthGuard)
  async nonFriendsUsers(@UserDeco() user :User) {
    return await this.userService.nonFriendsUsers(user.id);
  }
}
