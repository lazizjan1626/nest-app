import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response, Request } from 'express'; 
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async signup(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const newUser = await this.authService.create(createAuthDto, res);
        return res.status(201).json(newUser);
  }
  @Post('refresh-token')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed.' })
  @ApiResponse({ status: 400, description: 'Invalid refresh token.' })
  async refreshToken(
    @Body('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(refreshToken, res);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async login(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(createAuthDto, res);
  }

  @Post('signout')
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  async signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.signout(req, res);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'All users retrieved.' })
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated.' })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User removed.' })
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
