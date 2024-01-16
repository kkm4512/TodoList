import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from './secret';
  import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private authService:AuthService
      ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException('토큰이 존재하지 않습니다.');
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: jwtConstants.secret
          }
        );
        
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        
        request['user'] = payload;
        
        
      } catch {
        throw new UnauthorizedException();
      }
    
      this.authService.tokenValidate(request.headers.authorization)
      return true
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }