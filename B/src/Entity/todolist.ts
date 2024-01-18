import { IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, Entity, IsNull, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class todolist {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column()
    title: string;

    @CreateDateColumn()
    createdate: Date;

    @Column()
    author: string;

    
}
