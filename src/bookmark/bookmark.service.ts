import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor( private prisma:PrismaService){}
  async create(createBookmarkDto: CreateBookmarkDto) {
    try {
      const existingBookmark = await this.prisma.bookmark.findFirst({
        where:{PostId:createBookmarkDto.postId,UserId:createBookmarkDto.userId}
      })
        
      if(existingBookmark){
        return await this.prisma.bookmark.deleteMany({
          where:{
            UserId:existingBookmark.UserId,
            PostId:existingBookmark.PostId
          }
        })
      }

      return await this.prisma.bookmark.create({
        data:{
          PostId:createBookmarkDto.postId,
          UserId:createBookmarkDto.userId
        }
      })
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_REQUEST)
    }
  }

  async checkBookmark(postId :string,userId:string){
    try {
      const findPost = await this.prisma.post.findFirst({
        where :{id:postId}
      })
      if(!findPost) throw new HttpException("post not found",HttpStatus.CONFLICT)

      const findPostOnBookmark = await this.prisma.bookmark.findFirst({
        where:{PostId:postId,UserId:userId}
      })
      if(findPostOnBookmark){
        return true
      }else{return false}
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_REQUEST)
      
    }
  }

  async findOnBookmark(UserId:string){
    try {
      const postOnBookmark = await this.prisma.bookmark.findMany({
        where:{UserId},
        include:{
          Post:{
            include:{
              user:true
            }
          }
        }
      })
      return postOnBookmark
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_REQUEST)
    }
  }
}
