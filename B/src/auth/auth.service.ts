import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/DTO/userDTO';
import { auth_table } from 'src/Entity/auth_table';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(auth_table)
        private readonly authRepository:Repository<auth_table>,
        private readonly jwtService:JwtService
    ) { }

    userTokenCreate(user:UserDTO){
        return {
            accessToken: this.jwtService.sign(user)
        }
    }

    async userCheck(user:UserDTO): Promise<{accessToken: string}>{
        const userFind = await this.authRepository.findOne({
            where: {email: user.email}
        })
        
        if (!userFind){
            throw new UnauthorizedException()
        }

        
        //accessToken 생성
        const payload = this.userTokenCreate({
            email: userFind.email,
            password: userFind.password,
            nickname: userFind.nickname
        })
        
        return payload
    }    

    async registerUser(user:UserDTO){
        const userFind = await this.authRepository.findOne({
            where: {email: user.email}
        })
        
        


        
        //회원가입이 되어있지 않다면
        if(!userFind){
            const hashedPassword = bcrypt.hash(user.password,10)
            user.password = (await hashedPassword).toString()
            await this.authRepository.save(user)
            return user
        } else {
            throw new UnauthorizedException()
        }   
    }

    async tokenValidate(token:string){
        const tokenSplit = token.split(' ')
        if (tokenSplit.length === 2){
            return true
        } else {
            throw new UnauthorizedException('토큰이 올바르게 들어오지 않았습니다.')
        }
    }
}
