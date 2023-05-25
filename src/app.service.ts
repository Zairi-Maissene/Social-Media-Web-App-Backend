import { Injectable } from '@nestjs/common';
import {User} from "./user/entities/user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {SubscribeUser} from "./user/dto/create-user.dto";

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }


}
