import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CloudinaryService } from 'src/lib/config/cloudinary/cloudinary.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    userId: string,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ) {
    try {
      const uploadImage = async () => {
        try {
          console.log(file);
          
          const upload = await this.cloudinary.uploadImage(file);
          return (createPostDto.image_url = upload.secure_url);
        } catch (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
      };

      await Promise.all([uploadImage()]);

      return await this.prisma.post.create({
        data: {
          userId: userId,
          content: createPostDto.content,
          title: createPostDto.title,
          image_url: createPostDto.image_url,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const post = await this.prisma.post.findMany({
        orderBy: { datePost: 'desc' },
        include:{
          user:true
        }
      });

      return post;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.prisma.post.findFirst({ where: { id },include:{
        user:true
      } }
      );
      console.log(id);
      
      return post;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findByname(name: string) {
    try {
      const post = await this.prisma.post.findMany({
        where: {
          title: {
            contains: name,
            mode: 'insensitive',
          },
        },include:{
          user:true
        }
      });
      return post
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findByUserId(userId:string){
    try {
      const post  = await this.prisma.post.findMany({
        where:{userId},
        include:{
          user:true
        }
      })
      return post
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    file: Express.Multer.File,
  ) {
    try {
      const findpost = await this.prisma.post.findFirst({
        where: { id },
      });

      if (file === undefined) {
        return await this.prisma.post.update({
          where: { id: findpost.id },
          data: {
            title: updatePostDto.title,
            content: updatePostDto.content,
          },
        });
      }

      const deleteOldImage = async () => {
        try {
          return await this.cloudinary.deleteFile(findpost.image_url);
        } catch (error) {
          console.log(error);
        }
      };
      const uploadPhoto = async () => {
        try {
          const upload = await this.cloudinary.uploadImage(file);
          return (updatePostDto.image_url = upload.secure_url);
        } catch (error) {
          console.log(error);
        }
      };

      await Promise.all([deleteOldImage(), uploadPhoto()]);

      return await this.prisma.post.update({
        where: { id: findpost.id },
        data: updatePostDto,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string) {
    try {
      const findPost = await this.prisma.post.findFirst({
        where: { id },
      });

      const deleteOldImage = async () => {
        try {
          return await this.cloudinary.deleteFile(findPost.image_url);
        } catch (error) {
          console.log(error);
        }
      };

      await Promise.all([deleteOldImage()]);

      return await this.prisma.post.delete({ where: { id: findPost.id } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }
}
