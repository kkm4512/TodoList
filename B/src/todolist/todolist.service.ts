import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { todolist } from 'src/Entity/todolist';
import { Repository } from 'typeorm';

@Injectable()
export class TodolistService {
    constructor (
        @InjectRepository(todolist)
        private readonly todolistRepository:Repository<todolist>
        ){ }

        async todoSave(todoTitle:any){
            const todoList:todolist = new todolist();
            todoList.title = todoTitle.todo
            todoList.author = todoTitle.nickname
            const result = await this.todolistRepository.save(todoList)
            return result
        }

        async getTodoLists(){
            const result = await this.todolistRepository.find({
                order: {
                    createdate: 'DESC'
                }
            })
            return result
        }

        async removeLists(items:any){
            const newBodys = items.newTodos.map(item => item.id)
            await this.todolistRepository.delete(newBodys)
        }

}
