import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/DTO/userDTO';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/sequrity/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Res() res:Response,@Body() user: UserDTO){
    //미친 res.send() 해야 프론트로 데이터보내지네
    const result = await this.authService.userCheck(user)
    res.send(result)
  }

  @Post('signUp')
  async signUp(@Res() res:Response,@Body() user: UserDTO){
    const result = await this.authService.registerUser(user)
    res.send(result)
  }

  @Post('token')
  @UseGuards(AuthGuard)
  async getToken(@Req() req:Request,@Res() res:Response): Promise<any>{
    const result = await this.authService.tokenValidate(req.headers.authorization)
    res.send(result)
  }
}
