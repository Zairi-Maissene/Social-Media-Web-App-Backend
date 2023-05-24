import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('add')
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get('all')
  findAll() {
    return this.commentService.findAll();
  }

  @Get('byPost/:id')
  findByPost(@Param('id') id: string) {
    return this.commentService.getCommentsByPost(+id);
  }

  @Get('byWriter/:id')
  findByWriter(@Param('id') id: string) {
    return this.commentService.getCommentsByWriter(+id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch('Upadte/:id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
