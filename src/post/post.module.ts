import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryService } from 'src/lib/config/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/lib/config/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [PostController],
  providers: [PostService,PrismaService],
})
export class PostModule {}
