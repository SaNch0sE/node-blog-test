import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Users from './user.entity';
import Articles from './article.entity';

@Entity()
export default class ArticleLikes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Users,
    (user: Users) => user.comments,
  )
  public user: Users;

  @ManyToOne(
    () => Articles,
    (article: Articles) => article.comments,
  )
  public article: Articles;
}
