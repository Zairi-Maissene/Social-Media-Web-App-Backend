import { BadRequestException } from '@nestjs/common';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UpdateCommentDto } from './dto/update-comment.dto';
import { ReusableService } from 'src/reusable/reusable.service';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

import { UserService } from 'src/user/user.service';
import { SentCommentDto } from './dto/sent-comment.dto';

@Injectable()
export class CommentService extends ReusableService<Comment> {
  userService: UserService;
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {
    super(commentRepository);
  }
  async createComment(Dto: SentCommentDto) {
    const post = await this.postRepository.findOneBy({ id: Dto.postId });
    const comment = new Comment();
    comment.post = post;
    comment.writer = Dto.writer;
    comment.content = Dto.content;
    if (!Dto.content) {
      throw new BadRequestException('Comment content is empty');
    }
    if (!post) {
      throw new NotFoundException('Post not found');
    } else {
      console.log((await post).id.toString());
      return this.commentRepository.save(comment);
    }
  }

  findAll(): Promise<Comment[]> {
    return super.findAll();
  }

  findOne(id: string) {
    return super.findById(id);
  }

  async updateComment(
    user: User,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    console.log(updateCommentDto.content);
    const updateComment = await this.findById(updateCommentDto.id);
    if (updateComment) {
      if (updateComment.writer.id == user.id) {
        console.log('changed');
        console.log(updateCommentDto.content);
        console.log(updateCommentDto.id);
        return this.update(updateCommentDto.id, updateCommentDto);
      } else {
        throw new UnauthorizedException(
          ' only the writer can edit the comment',
        );
      }
    } else throw new NotFoundException(' comment not found ');
  }

  async remove(id: string, user: User) {
    const deletedComment = await this.findById(id);
    if (deletedComment) {
      if (
        deletedComment.writer.id == user.id ||
        deletedComment.post.owner.id == user.id
      )
        super.delete(id);
      else {
        throw new UnauthorizedException(
          ' only the writer of the comment or the owner of post can delete the comment ',
        );
      }
      return this.findAll();
    }
  }

  async getCommentsByPost(postId: string) {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .where('post.id = :postId', { postId })
      .getMany();

    if (comments.length === 0) {
      throw new NotFoundException(`Comments with Post id ${postId} not found`);
    }

    return comments;
  }

  async getCommentsByWriter(writerId: string) {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.writer', 'writer')
      .where('writer.id = :writerId', { writerId })
      .getMany();
    if (!comments.length)
      throw new NotFoundException(
        `Comments with writer id ${writerId} not found`,
      );
    else return comments;
  }
}
