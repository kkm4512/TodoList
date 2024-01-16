import { Body, Controller, Delete, Get, Post, Res } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { todolistDto } from 'src/DTO/todolist.dto';
import { Response } from 'express';
import { todolist } from 'src/Entity/todolist';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Post()
  async todolistSave(@Res() res:Response,@Body() body:todolistDto){
    const result = await this.todolistService.todoSave(body)
    res.send(result)
  }

  @Get()
  async getTodoLists(@Res() res:Response){
    const result = await this.todolistService.getTodoLists()
    res.send(result)
  }

  @Delete()
  async deleteList(@Res() res:Response,@Body() body:todolist){
    const result = await this.todolistService.removeLists(body)
    res.send(true)
  }

  
}
