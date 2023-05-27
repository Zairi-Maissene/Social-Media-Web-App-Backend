import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SubscribeUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {LoginDto} from "./dto/login-user.dto";
import {User} from "./entities/user.entity";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
   create(@Body() createUserDto: SubscribeUser):Promise<User> {
    console.log(createUserDto)
    return  this.userService.subscribe(createUserDto);
  }
  @Post("/login")
  login (@Body() credentials : LoginDto)  {

    return  this.userService.login(credentials);
  }

  @Get()
  findAll() {
    return this.userService.getALLUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
