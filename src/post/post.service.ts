import {
  BadRequestException,
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
import { DisplayedPostDto } from './dto/diplayed-post.dto';
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
  async addPost(createPostDto: CreatePostDto) {
    if (createPostDto.content == '' && createPostDto.imageUrl == '') {
      throw new BadRequestException('Either file or content must be provided');
    } else {
      console.log('addedPost: ' + createPostDto);
      return await super.create(createPostDto);
    }
  }
  async findAll() {
    return await super.findAll();
  }
  async findOne(id: string): Promise<Post> {
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
    if (!deletedPost) {
      throw new NotFoundException('Cannot find post');
    }
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
    let comments = await this.commentRepository.find({
      relations: {
        post: true,
        writer: true,
      },
    });
    comments = comments.filter((comment) => comment.post?.id == postId);
    return comments;
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
    if (friends) {
      for (const e of friends) {
        const posts: Post[] = await this.getPostsOfUser(e.id, userId);
        allPosts.push(posts);
      }
      return allPosts;
    } else return ' go get some friends';
  }
  async getPostsOfUser(userId: string, loggedUser: string): Promise<Post[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.owner', 'owner')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('owner.id = :userId', { userId })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
    const user = await this.userRepository.findOneByOrFail({ id: loggedUser });
    if (posts) {
      const displayedPosts: DisplayedPostDto[] = [];
      for (const post of posts) {
        const likes: User[] = await this.getLikesOfPost(post.id);
        const displayedPost: DisplayedPostDto = {
          comments: await this.getCommentsByPost(post.id),
          content: post.content,
          createdAt: post.createdAt,
          deletedAt: post.deletedAt,
          id: post.id,
          imageUrl: post.imageUrl || '',
          likes: likes,
          numberOfComments: await this.getNumberOfCommentsOfPost(post.id),
          numberOfLikes: await this.getNumberOfLikesOfPost(post.id),
          owner: post.owner,
          updatedAt: post.updatedAt,
          isLiked: likes.findIndex((item) => item.id == loggedUser) >= 0,
        };
        displayedPosts.push(displayedPost);
      }

      return displayedPosts;
    } else throw new NotFoundException('this user does not have posts');
  }

  async getNumberOfCommentsOfPost(id: string): Promise<any> {
    const post = await this.findOne(id);
    if (post) return post.comments.length;
    else throw new NotFoundException('Post not found');
  }
}
