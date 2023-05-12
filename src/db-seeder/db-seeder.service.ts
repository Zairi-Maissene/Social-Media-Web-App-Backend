import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {randPassword, randUserName, randEmail, randPhoneNumber, randGender} from '@ngneat/falso';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DbSeederService {
  constructor(
    @InjectRepository(User) private userEntityRepository: Repository<User>,
  ) {}

  async seedDataBase() {
    const users: User[] = [];
    for (let i = 0; i < 20; i++) {
      const user = new User();
      user.username = randUserName();
      user.email = randEmail({firstName:user.username});
      user.password = randPassword();
      user.friends = users;
      user.phoneNumber=randPhoneNumber();
      user.gender = randGender();
      if (i%2 == 0) {
        user.gender = 'male';
        user.image="https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"

      }

      else { user.gender = 'female'; user.image =`https://cdn-icons-png.flaticon.com/512/219/219969.png`;}
      users.push(user);
    }
    await this.userEntityRepository.save(users);
    return 'done';
  }
}
