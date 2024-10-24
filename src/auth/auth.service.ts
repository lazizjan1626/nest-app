import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto, UpdateAuthDto } from './dto/index';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async updateRefreshTokan(userId:number,refresh_token:string){
    const hashadRefreshToken = await bcrypt.hash(refresh_token,7);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: hashadRefreshToken },
    });
  }

  async create(createAuthDto: CreateAuthDto, res: Response) {
    const { email, password } = createAuthDto;

    const candidate = await this.prismaService.user.findUnique({
      where: { email: createAuthDto.email },
    });
    if (candidate) {
      throw new BadRequestException(`User ${createAuthDto.email} already exists`);
    }
    if (createAuthDto.password !== createAuthDto.conifrom_password) {
      throw new BadRequestException("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const newUser = await this.prismaService.user.create({
      data: {
        email: createAuthDto.email,
        hashedPassword, 
      },
    });
    const tokens = await this.generateTokens(newUser);

    return {newUser, tokens};
  }

  async login(createAuthDto: CreateAuthDto, res: Response) {
    const { email, password } = createAuthDto;
  
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
  
    const tokens = await this.generateTokens(user);

    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });
  
    return { user, tokens: { access_token: tokens.access_token } };
  }
  

  async generateTokens(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return { access_token, refresh_token };
  }
  async refreshToken(refresh_token: string,res: Response) {
    try {
      const payload = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY, 
      });
      if (!payload.id) {
        throw new BadRequestException('payload yuq');
      }

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new BadRequestException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);

      res.cookie('refreshToken', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: Number(process.env.COOKIE_TIME),
      });
      console.log(tokens);

      return tokens;
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Invalid refresh ');
    }
  }
  async signout(req: any, res: Response) {
    const refresh_token = req.cookies.refreshToken; 
  
    if (!refresh_token) {
      throw new BadRequestException('Refresh token not found');
    }
  
    res.clearCookie('refreshToken', { secure: true });
    return 'Logged out successfully';
  }
  
  async findAll() {
    return this.prismaService.user.findMany(); 
  }

  async findOne(id: number) {

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: updateAuthDto,
    });

    return updatedUser;
  }

  async remove(id: number) {

    const user = await this.prismaService.user.delete({
      where: { id },
    });

    return user;
  }
}
