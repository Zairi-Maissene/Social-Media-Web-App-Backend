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
import { Comment } from '../comment/entities/comment.entity';
import { FriendRequest } from 'src/friend-request/entities/friend-request.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class PostService extends ReusableService<Post> {
  private userService: any;
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private friendRequestEntityRepository: Repository<FriendRequest>,
  ) {
    super(postRepository);
  }

  addPost(createPostDto: CreatePostDto) {
    console.log('addedPost: ' + createPostDto);
    return super.create(createPostDto);
  }

  findAll() {
    return super.findAll();
  }

  findOne(id: string): Promise<Post> {
    return super.findById(id);
  }

  async updatePost(user: User, post: UpdatePostDto) {
    const updatedPost = await this.findById(post.id);
    console.log('owner ' + updatedPost.owner.username);
    if (updatedPost.owner.id === user.id) {
      return this.update(post.id, post);
    } else {
      throw new UnauthorizedException(
        ' Only the writer of the post can edit it ',
      );
    }
  }

  async remove(id: number, user: User) {
    const deletedPost = await this.findById(id.toString());
    if (deletedPost.owner.id === user.id) {
      return super.delete(id.toString());
    } else
      throw new UnauthorizedException(' Only the owner can delete his post');
  }

  async getNumberOfLikesOfPost(id: string): Promise<any> {
    const post = await this.findOne(id);
    if (post) return post.likes.length;
    else throw new NotFoundException('Post not found');
  }

  async getLikesOfPost(id: string): Promise<any> {
    const post = await this.findOne(id);
    if (post) return post.likes;
    else throw new NotFoundException('Post not found');
  }
  async likePost(id: string, user: User): Promise<Post> {
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

  async dislikePost(userId: string, postId): Promise<Post> {
    const post = await this.findOne(postId);

    if (post) {
      post.likes.forEach((e) => {
        console.log('bnj' + e.id);
      });

      const index = post.likes.findIndex((item) => item.id == userId);

      if (index >= 0) {
        console.log('index user ' + index);
        post.likes = post.likes.filter((user) => user.id != userId);
      } else throw new NotFoundException(' User not found in list of likes');
      post.likes.forEach((e) => {
        console.log(e.id);
        console.log(e.username);
        console.log(e.email);
      });
    } else throw new NotFoundException('Post not found ');

    return this.postRepository.save(post);
  }
  async getCommentsByPost(postId: string) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment')
      .select(['post.id', 'comment.id', 'comment.content'])
      .where('post.id = :postId', { postId })
      .getOne();
    return post.comments;
  }

  async getPostsOfMyFriends(userId: string) {
    const allPosts = [];
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        friends: true,
      },
    });
    const friends = user.friends;

    console.log('friends' + friends);

    for (const e of friends) {
      const id = e.id;
      const posts: Post[] = await this.getPostsOfUser(e.id);
      console.log(posts);
      allPosts.push(posts);
    }

    return allPosts;
  }
  async getNumberOfCommentsOfPost(id: string): Promise<any> {
    const post = await this.findOne(id);
    if (post) return post.comments.length;
    else throw new NotFoundException('Post not found');
  }

  async getPostsOfUser(id: string): Promise<Post[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.owner', 'owner')
      .where('owner.id = :id', { id })
      .getMany();

    console.log(posts);
    if (posts) return posts;
    else throw new NotFoundException('this user does not have posts');
  }
}
