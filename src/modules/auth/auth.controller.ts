
import { Body, Controller, Post, HttpCode, HttpStatus, Get, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'dto/signin.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorators';
import { Request as ExpressRequest } from 'express';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('register')
  @ApiResponse({status: 201, description: 'Register user'})
  register(@Body() signInDto: SignInDto) {
    return this.authService.register(signInDto);
  }

  @Get('logout')
  @ApiBearerAuth()
  @ApiResponse({status: 200, description: 'Log out user'})
  logOut(@Req() request: ExpressRequest){
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      const token = authHeader.split(' ')[1];
      return this.authService.logOut(token);
    }
  }

}
