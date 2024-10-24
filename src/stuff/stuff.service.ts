import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStuffDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';

@Injectable()
export class StuffService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(id: number): Promise<any> {
    return this.prisma.stuff.findFirst({ where: { id:id} });
  }

  generateTokens(user: any) {
    const payload = { phone_number: user.phone_number, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: 'ACCESS_SECRET',
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: 'REFRESH_SECRET',
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async signup(createStuffDto: CreateStuffDto, res: Response): Promise<any> {
    const hashedPassword = await bcrypt.hash(createStuffDto.password, 10);
    const newUser = await this.prisma.stuff.create({
      data: {
        ...createStuffDto,
        password: hashedPassword,
        is_active: true,
      },
    });


    const tokens = this.generateTokens(newUser);

  
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,  
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.json({ access_token: tokens.accessToken });
  }

  async login(user: any, res: Response) {
    const tokens = this.generateTokens(user);

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ access_token: tokens.accessToken });
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is missing' });
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret:process.env.ACCESS_TOKEN_KEY,
      });
      const user = await this.validateUser(payload.sub);

      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const tokens = this.generateTokens(user);

      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ access_token: tokens.accessToken });
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  }

  async signOut(res: Response) {
    res.clearCookie('refresh_token');
    return res.json({ message: 'Signed out successfully' });
  }
}
