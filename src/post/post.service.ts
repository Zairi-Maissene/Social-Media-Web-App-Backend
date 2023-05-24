import { Injectable } from '@nestjs/common';
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
import { CreateReusableDto } from 'src/reusable/dto/create-reusable.dto';

@Injectable()
export class PostService  extends ReusableService<Post>{
  commentService : CommentService;
  userService: UserService;
  constructor (
    @InjectRepository(Post)
    private postRepository:Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository:Repository<Comment>,
    @InjectRepository(User)
    private userRepository:Repository<User>,
    @InjectRepository(FriendRequest)
    private friendRequestEntityRepository: Repository<FriendRequest>,
   ){
      super(postRepository)
      this.commentService = new CommentService(commentRepository)
      this.userService = new UserService(friendRequestEntityRepository,userRepository)
    }
  
  addPost(content:string,image:String) {
    let createPostDto= new  CreatePostDto() ;
    console.log ("this is content  : "+ content);
    createPostDto.content=content;
    createPostDto.imageUrl=image;
    return super.create(createPostDto);
  }

  findAll() {
    return super.findAll();
  }

  findOne(id: number):Promise<Post>{
    return super.findById(id.toString());
  }

  updatePost(id: string, content:string,image:string) {
   var updatePostDto= new UpdatePostDto();
   updatePostDto.content=content;
    updatePostDto.imageUrl=image;
    return super.update(id,updatePostDto);
  }

  remove(id: number) {
    return super.delete(id.toString());
  }

  async getCommentsOfPost( id : number):Promise<Comment[]>
  {
    var  comments = await this.commentService.findAll();
    const  specific_comments =[]
    for(const comment of  comments){

      if (comment.post.id == id.toString())
      specific_comments.push(comment);
    }
    return specific_comments;

  }


  async getNumberOfLikesOfPost (id : number): Promise <any>{
    var post = await this.findOne(id);
    return post.likes.length;
  }


 async  likePost(id :number):Promise<Post>{
    var post = await this.findOne(id) ;
    var user = await this.userRepository.findOneBy({id:"1"});
    
    post.likes.push(user);
   
    post.likes.forEach(e => {
      console.log(" id "+ e.id )
      console.log(" mail"+ e.email)
      console.log(" username "+ e.username)
      
      
    });

    return this.postRepository.save(post);

  }

 async  dislikePost(userId :number,postId): Promise<Post>{
    var post = await this.findOne(postId) ;
   console.log("userid "+userId);
    const index = post.likes.findIndex(item => item.id == userId.toString());
    console.log("index user "+index)
    post.likes = post.likes.filter((user)=> user.id != userId.toString());
    post.likes.forEach(e => {
      console.log(e.id);
      console.log(e.username);
      console.log(e.email);
      
    });
    
    return this.postRepository.save(post);
  }


   
}


