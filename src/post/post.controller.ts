import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/lib/auth/authguard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() image,
  ) {
    const userId = req.user.id;
    return this.postService.create(userId, createPostDto, image);
  }

  @Get()
  async findAll() {
    return this.postService.findAll();
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Get('name/:name')
  async findByname(@Param('name')name:string){
    return this.postService.findByname(name)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findByUser(@Request() req) {
    return this.postService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() image,
  ) {
    return this.postService.update(id, updatePostDto, image);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
