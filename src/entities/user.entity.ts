import {
  Entity, Column, PrimaryGeneratedColumn, OneToMany,
} from 'typeorm';
import Articles from './article.entity';
import Comments from './comment.entity';
import ArticleLikes from './articleLike.entity';
import CommentLikes from './commentLike.entity';

@Entity()
export default class Users {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public full_name: string;

  @Column()
  public login: string;

  @Column()
  public password: string;

  @OneToMany(
    () => Articles,
    (article: Articles) => article.author,
  )
  public articles: Articles[];

  @OneToMany(
    () => Comments,
    (comment: Comments) => comment.author,
  )
  public comments: Comments[];

  @OneToMany(
    () => ArticleLikes,
    (likes: ArticleLikes) => likes.user,
  )
  public article_likes: ArticleLikes[];

  @OneToMany(
    () => CommentLikes,
    (likes: CommentLikes) => likes.user,
  )
  public comments_likes: CommentLikes[];
}
