import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { auth_table } from './Entity/auth_table';
import { TodolistModule } from './todolist/todolist.module';
import { todolist } from './Entity/todolist';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '!@skdud340',
      database: 'fbauth',
      entities: [auth_table,todolist],
      synchronize: true,
    }),
    TodolistModule,    

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}