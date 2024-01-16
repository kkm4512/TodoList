import { Module } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { TodolistController } from './todolist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { todolist } from 'src/Entity/todolist';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([todolist]),
    AuthModule
  ],

  controllers: [TodolistController],
  providers: [TodolistService],
})
export class TodolistModule {}
