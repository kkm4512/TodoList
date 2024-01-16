import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class auth_table {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    nickname: string;

}