// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: '', 
      signOptions: { expiresIn: '60s' }, 
    }),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
