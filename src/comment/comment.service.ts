import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ReusableService } from 'src/reusable/reusable.service';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises } from 'dns';
import { NotFoundError } from 'rxjs';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { FriendRequest } from 'src/friend-request/entities/friend-request.entity';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService extends ReusableService<Comment>{
  postService : PostService;
  userService: UserService;
  constructor (
  
  @InjectRepository(Comment)
  private commentRepository:Repository<Comment>,
  ){
    super(commentRepository)
   
  }

  
  create(Dto: CreateCommentDto) {
     const { content, postId } = Dto;
    const comment = new Comment();
    comment.content = content;
    comment.post = { id: postId } as any; // Set the post relationship using postId

    return this.commentRepository.save(comment);
   
  }

  findAll() : Promise<Comment[]>{
    return super.findAll();
  }

  findOne(id: number) {
    return super.findById(id.toString());
  }

  update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return super.update(id,updateCommentDto);
  }

  remove(id: number) {
    super.delete((id.toString()),);
    return this.findAll()
  }

  async getCommentsByPost(postId:number){
    var comments = await this.commentRepository.createQueryBuilder('comment')
    .leftJoinAndSelect('comment.post', 'post')
    .where('post.id = :postId', { postId })
    .getMany();
    if (!comments.length)
    throw new NotFoundException(`Comments with Post id ${postId} not found`)
    else 
    return comments
  }
 async getCommentsByWriter (writerId:number){
    var comments = await this.commentRepository.createQueryBuilder('comment')
    .leftJoinAndSelect('comment.writer', 'writer')
    .where('writer.id = :writerId', { writerId })
    .getMany();
    if (!comments.length)
    throw new NotFoundException(`Comments with writer id ${writerId} not found`)
    else 
    return comments
  }
  
}
