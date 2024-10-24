import { Module } from '@nestjs/common';
import { StuffService } from './stuff.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthStuffController } from './stuff.controller';
import { JwtStrategy } from './strategy';

@Module({
  exports: [StuffService],
  imports: [PrismaModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY,
      signOptions: { expiresIn: '1h' }, 
    }),
    StuffModule,
  ],
  controllers: [AuthStuffController],
  providers: [StuffService,JwtStrategy],
})
export class StuffModule {}
