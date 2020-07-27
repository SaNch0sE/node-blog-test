import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Users } from './user.entity';
import { Comments } from './comment.entity';

@Entity()
export class Articles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likes: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Users, (user: Users) => user.articles)
  public author: Users;

  @OneToMany(() => Comments, (comment: Comments) => comment.article)
  public comments: Comments[];
}
