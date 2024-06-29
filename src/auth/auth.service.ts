import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from 'src/lib/config/cloudinary/cloudinary.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cloudinary: CloudinaryService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    try {
      const hashPassword = await bcrypt.hash(createAuthDto.password, 10);
      const register = await this.prisma.user.create({
        data: {
          email: createAuthDto.email,
          name: createAuthDto.name,
          password: hashPassword,
          phone: createAuthDto.phone,
        },
      });

      return {
        name: register.name,
        email: register.email,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_GATEWAY);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: { email: loginDto.email },
      });

      if (!findUser)
        throw new HttpException('check your input', HttpStatus.UNAUTHORIZED);

      const matchPassword = await bcrypt.compare(
        loginDto.password,
        findUser.password,
      );

      if (!matchPassword)
        throw new HttpException('check Your Input', HttpStatus.UNAUTHORIZED);

      const payload = {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
      };
       
      console.log(payload);
      
      return { token: this.jwtService.sign(payload) };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });

      return user;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(userId:string,data:UpdateAuthDto,file:Express.Multer.File){
    try {
      const findUser= await this.prisma.user.findFirst({
        where:{id:userId}
      })

      const deleteOldImage = async ()=>{
        try {
          return await this.cloudinary.deleteFile(findUser.photoProfile)
      } catch (error) {
        console.log(error);        
      }
      }

      const uploadPhoto = async()=>{
        try {
          const upload = await this.cloudinary.uploadImage(file)
          return data.photoProfile = upload.secure_url
        } catch (error) {
          console.log(error);
          
        }
      }
      await Promise.all([deleteOldImage(),uploadPhoto()])

      return await this.prisma.user.update({
        where:{id:findUser.id},
        data:data
      })
    } catch (error) {
      throw new HttpException(error,HttpStatus.BAD_REQUEST)
    }
  }

  async delete(userId:string){
    try {
      const findUser = await this.prisma.user.findFirst({
        where:{id:userId}
      })

      const deleteOldImage = async ()=>{
        try {
          return await this.cloudinary.deleteFile(findUser.photoProfile)
      } catch (error) {
        console.log(error);        
      }
      }

      await Promise.all([deleteOldImage()])

      return await this.prisma.user.delete({
        where:{id:findUser.id}
      })
    } catch (error) {
      
    }
  }
}
