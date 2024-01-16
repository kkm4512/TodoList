import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { auth_table } from 'src/Entity/auth_table';
import { todolist } from 'src/Entity/todolist';
import { Repository } from 'typeorm';

@Injectable()
export class TodolistService {
    constructor (
        @InjectRepository(todolist)
        private readonly todolistRepository:Repository<todolist>,
        @InjectRepository(auth_table)
        private readonly authRepository:Repository<auth_table>
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

        async patchedList (body:any){
            const authorFind = await this.authRepository.findOne({where : { nickname: body.author}})
            if(!authorFind){
                return new UnauthorizedException(`해당하는 작성자는 존재하지않아 변경이 불가합니다.`)
            }
            
            const listFind = await this.todolistRepository.findOne({where: {id: body.id}})
            const { title,author } = listFind
            const newList = Object.assign(listFind,{
                title: body.title,
                author: body.author
            })


            
            

            await this.todolistRepository.save(newList)
            return newList
        }

}
