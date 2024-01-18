import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { todolistDto } from 'src/DTO/todolist.dto';
import { Response } from 'express';
import { todolist } from 'src/Entity/todolist';
import { brotliDecompressSync } from 'zlib';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async todolistSave(@Res() res:Response,@Body() body:todolistDto){
    const result = await this.todolistService.todoSave(body)
    res.send(result)
  }

  @Get()
  async getTodoLists(@Res() res:Response){
    const result = await this.todolistService.getTodoLists()
    console.log(result)
    res.send(result)
  }

  @Delete()
  async deleteList(@Res() res:Response,@Body() body:todolist){
    const result = await this.todolistService.removeLists(body)
    res.send(true)
  }

  @Patch()
  async patchedList(
    @Res() res:Response,
    @Body() body:any
  ){
    const result = await this.todolistService.patchedList(body)
    res.send(result)
  }

  @Get('/sendPage/:id')
  async getPage(
    @Res() res:Response,
    @Param('id') id:any
  ){
    const result = await this.todolistService.getPagetodoLists(id)
    res.send(result)
  }

  
}
