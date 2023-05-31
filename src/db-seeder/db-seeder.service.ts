import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {randEmail, randGender, randPassword, randPhoneNumber, randUserName} from '@ngneat/falso';
import {Repository} from 'typeorm';
import {User} from '../user/entities/user.entity';
import {Gender} from "../enums/user-gender.enum";
import {Post} from "../post/entities/post.entity";

@Injectable()
export class DbSeederService {
  constructor(
      @InjectRepository(User) private userEntityRepository: Repository<User>,
      @InjectRepository(Post) private PostEntityRepository: Repository<Post>,
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
      let j=i-1;

      const friends: User[] = [];
      while(j>0 && j>i-5)
      {
        friends.push(users[j]);
        j--;
      }
      if (i%2 == 0) {
        user.gender = Gender.MALE;
        user.image="https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"

      }

      else { user.gender = Gender.FEMALE; user.image =`https://cdn-icons-png.flaticon.com/512/219/219969.png`;}
      user.posts = [];
      users.push(user);
    }
    await this.userEntityRepository.save(users);
    return 'done';
  }
  async seedDataBasePosts(){
    let users: User[] = await this.userEntityRepository.find();
    const posts: Post[] = [];
    for(let i=0;i<20;i++){

      const post =new Post();
      post.content="this is the post of"+users[i].username;
      post.owner=users[i];
      posts.push(post);
    }
    await this.PostEntityRepository.save(posts);
  }

}
