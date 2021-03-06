import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import Users from './user.entity';
import Articles from './article.entity';
import CommentLikes from './commentLike.entity';

@Entity()
export default class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(
    () => Users,
    (user: Users) => user.comments,
  )
  public author: Users;

  @ManyToOne(
    () => Articles,
    (article: Articles) => article.comments,
  )
  public article: Articles;

  @OneToMany(
    () => CommentLikes,
    (likes: CommentLikes) => likes.comment,
  )
  public likes: CommentLikes[];
}
