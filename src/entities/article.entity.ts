import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import Users from './user.entity';
import Comments from './comment.entity';
import ArticleLikes from './articleLike.entity';

@Entity()
export default class Articles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(
    () => Users,
    (user: Users) => user.articles,
  )
  public author: Users;

  @OneToMany(
    () => Comments,
    (comment: Comments) => comment.article,
  )
  public comments: Comments[];

  @OneToMany(
    () => ArticleLikes,
    (likes: ArticleLikes) => likes.article,
  )
  public likes: ArticleLikes[];
}
