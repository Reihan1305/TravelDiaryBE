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
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { JwtAuthGuard } from 'src/lib/auth/authguard';

@UseGuards(JwtAuthGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}
  @Post(':postId')
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @Param('postId') postId: string,
    @Request() req,
  ) {
    createBookmarkDto.postId = postId;
    createBookmarkDto.userId = req.user.id;

    return this.bookmarkService.create(createBookmarkDto);
  }

  @Get()
  findUserBookmark(@Request() req) {
    console.log(req.user.id);

    return this.bookmarkService.findOnBookmark(req.user.id);
  }

  @Get('onBookmark/:postId')
  checkOnBookmark(@Param('postId') postId: string, @Request() req) {
    return this.bookmarkService.checkBookmark(postId, req.user.id);
  }
}
