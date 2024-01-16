import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { auth_table } from 'src/Entity/auth_table';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/sequrity/secret';

@Module({
  imports: [
    TypeOrmModule.forFeature([auth_table]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),    
  ],
  exports: [TypeOrmModule.forFeature([auth_table])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
