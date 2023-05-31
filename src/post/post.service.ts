import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ReusableService } from '../reusable/reusable.service';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentService } from '../comment/comment.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { FriendRequest } from 'src/friend-request/entities/friend-request.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class PostService extends ReusableService<Post> {
  userService: UserService;
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FriendRequest)


    private friendRequestEntityRepository: Repository<FriendRequest>,
    private jwtService: JwtService,
  ) {
    super(postRepository);

    this.userService = new UserService(
      friendRequestEntityRepository,
      userRepository,
      jwtService,
    );
  }

  addPost(createPostDto: CreatePostDto) {
    console.log('addedPost: ' + createPostDto);
    return super.create(createPostDto);
  }

  findAll() {
    return super.findAll();
  }

  findOne(id: number): Promise<Post> {
    return super.findById(id.toString());
  }

  async updatePost(user: any, post: UpdatePostDto) {
    const updatedPost = await this.findById(post.id);
   // if (updatedPost.owner != user) {
     // throw new UnauthorizedException(
       // ' Only the writer of the post can edit it ',
      //);
    //} else {
      return this.update(post.id, post);
    //}
  }

  async remove(id: number, user: User) {
    const deletedPost = await this.findById(id.toString());
    if (deletedPost.owner == user) {
      return super.delete(id.toString());
    } else throw new UnauthorizedException();
  }

  async getNumberOfLikesOfPost(id: number): Promise<any> {
    const post = await this.findOne(id);
    if (post) return post.likes.length;
    else throw new NotFoundException('Post not found');
  }

  async getLikesOfPost(id: number): Promise<any> {
    const post = await this.findOne(id);
    if (post) return post.likes;
    else throw new NotFoundException('Post not found');
  }
  async likePost(id: number, user: User): Promise<Post> {
    const post = await this.findOne(id);
    console.log(user);
    if (post) {
      if (!post.likes.includes(user)) {
        post.likes.push(user);
      }
    } else throw new NotFoundException('Post not found');

    //post.likes.forEach((e) => {
    //console.log(' id ' + e.id);
    // console.log(' mail' + e.email);
    //console.log(' username ' + e.username);
    //});

    return this.postRepository.save(post);
  }

  async dislikePost(userId: number, postId): Promise<Post> {
    const post = await this.findOne(postId);

    if (post) {
      post.likes.forEach((e) => {
        console.log(e.id);
      });

      console.log('userid ' + userId);
      const index = post.likes.findIndex(
        (item) => item.id === userId.toString(),
      );
      if (index) {
        console.log('index user ' + index);
        post.likes = post.likes.filter((user) => user.id != userId.toString());
      } else throw new NotFoundException(' User not found in list of likes');
      post.likes.forEach((e) => {
        console.log(e.id);
        console.log(e.username);
        console.log(e.email);
      });
    } else throw new NotFoundException('Post not found ');

    return this.postRepository.save(post);
  }
}
