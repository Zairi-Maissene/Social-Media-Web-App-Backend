import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/';
import { JwtAuthGuard } from '../user/Guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { Request } from 'express';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body('content') content: string,
    @UploadedFile() file: Express.Multer.File,
    @User() user,
  ) {
    console.log('content :' + content);
    const image = file.originalname;
    //const us = request.user;
    //console.log('logged user ' + us.email);
    // console.log('image',body.image);
    //console.log(' AUser : ' + user.username + user.email);
    const post: CreatePostDto = {
      content: content,
      imageUrl: image,
      owner: user,
    };
    return await this.postService.addPost(post);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@User() user, @Param('id') id) {
    return this.postService.delete(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('content') content: string,
    @User() user,
  ) {
    const image = file.originalname;
    const userid = 11;
    //console.log('logged user ' + user.email);
    const post: UpdatePostDto = {
      id: userid.toString(),
      content: content,
      imageUrl: image,
    };
    return this.postService.updatePost(userid, post);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request: Request) {
    return request.user;
  }

  @Get('numberOFlikes/:id')
  getNumberOfLikesById(@Param('id') id: number) {
    return this.postService.getNumberOfLikesOfPost(id);
  }
  @Get('likes/:id')
  getLikesById(@Param('id') id: number) {
    return this.postService.getLikesOfPost(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Post('like/:id')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('id', ParseIntPipe) id: number, @User() user) {
    console.log(user);
    return await this.postService.likePost(id, user);
  }

  @Delete('dislike/:post/:userid')
  // @UseGuards(JwtAuthGuard)
  async dislikePost(
    @Param('user', ParseIntPipe) userId: number,
    @Param('post', ParseIntPipe) postId: number,

    // @AUser() user,
  ) {
    return await this.postService.dislikePost(userId, postId);
  }

  @Get('test/user')
  @UseGuards(JwtAuthGuard)
  test(@User() user) {
    return user;
  }
}
