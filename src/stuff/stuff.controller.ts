import { Controller, Post, Res, Req, Body } from '@nestjs/common';
import { StuffService } from './stuff.service';
import { CreateStuffDto } from './dto';
import { Request, Response } from 'express';

@Controller('stuff/auth')
export class AuthStuffController {
  constructor(private readonly stuffService: StuffService) {}

  @Post('signup')
  async signup(@Body() createStuffDto: CreateStuffDto, @Res() res: Response) {
    return this.stuffService.signup(createStuffDto, res);
  }

  @Post('login')
  async login(@Body() stuffDto: any, @Res() res: Response) {
    const stuff = await this.stuffService.validateUser(stuffDto.id);
    return this.stuffService.login(stuff, res);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.stuffService.refreshToken(req, res);
  }

  @Post('signout')
  async signOut(@Res() res: Response) {
    return this.stuffService.signOut(res);
  }
}
