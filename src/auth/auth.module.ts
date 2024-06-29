import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/lib/config/cloudinary/cloudinary.module';
import { JwtAuthGuard } from 'src/lib/auth/authguard';
import { CloudinaryService } from 'src/lib/config/cloudinary/cloudinary.service';
import { JwtStrategy } from 'src/lib/auth/JwtStrategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'TravelDiary',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    CloudinaryService,
    JwtStrategy
  ],
})
export class AuthModule {}
