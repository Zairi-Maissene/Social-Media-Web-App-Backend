import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randPassword, randUserName, randEmail } from '@ngneat/falso';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DbSeederService {
  constructor(
    @InjectRepository(User) private userEntityRepository: Repository<User>,
  ) {}

  async seedDataBase() {
    const users: User[] = [];
    for (let i = 0; i < 10; i++) {
      const user = new User();
      user.email = randEmail();
      user.username = randUserName();
      user.password = randPassword();
      user.friends = users;
      users.push(user);
    }
    await this.userEntityRepository.save(users);
    return 'done';
  }
}
