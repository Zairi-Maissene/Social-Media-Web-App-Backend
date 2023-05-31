import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

import { JwtAuthGuard } from '../user/Guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('add/:id')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() body: { content: string },
    @User() user,
    @Param('id') postId: string,
  ) {
    const comment: CreateCommentDto = {
      content: body.content,
      postId: postId,
      writer: user,
    };
    return this.commentService.create(comment);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.commentService.findAll();
  }

  @Get('byPost/:id')
  findByPost(@Param('id') id: string) {
    return this.commentService.getCommentsByPost(id);
  }

  @Get('byWriter')
  @UseGuards(JwtAuthGuard)
  findByWriter(@User() user) {
    return this.commentService.getCommentsByWriter(user.id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body('content') content: string,
    @User() user,
  ) {
    const updateCommentDto = { id: id, content: content };
    return this.commentService.updateComment(user, updateCommentDto);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @User() user) {
    return this.commentService.remove(id, user);
  }
}
