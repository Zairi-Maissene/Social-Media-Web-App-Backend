import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body('content') content: string, @UploadedFile() file: Express.Multer.File,) {
    console.log("content :" +content);
   const image = file.originalname;
   return await  this.postService.addPost(content,image);
 
  }
  
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id') id: string, 
  @UploadedFile() file: Express.Multer.File,
  @Body('content') content :string,) {
    const image = file.originalname;
    return this.postService.updatePost(id, content,image);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }
  @Get('likes/:id')
  getLikesById(@Param ('id')id: number) {
    return this.postService.getNumberOfLikesOfPost(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }

@Post('like/:id')
  async likePost(
    @Param('id', ParseIntPipe) id: number,
  
  ){
    return await this.postService.likePost(id);
  }

  @Delete('dislike/:user/:post')
  async dislikePost(
    @Param('user', ParseIntPipe) userId: number,
    @Param('post', ParseIntPipe) postId: number,
  
  ){
   return  await this.postService.dislikePost(userId,postId);
  }
}
