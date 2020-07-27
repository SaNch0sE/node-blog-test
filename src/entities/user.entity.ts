import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Articles } from './article.entity';
import { Comments } from './comment.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public full_name: string;

  @Column()
  public login: string;

  @Column()
  public password: boolean;

  @OneToMany(() => Articles, (article: Articles) => article.author)
  public articles: Articles[];

  @OneToMany(() => Comments, (comment: Comments) => comment.author)
  public comments: Comments[];
}