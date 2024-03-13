import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  username: string;

  @Column('varchar')
  password: string;

  @Column('text')
  role: 'admin' | 'user';
  
}