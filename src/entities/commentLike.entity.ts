import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './user.entity';
import { Comments } from './comment.entity';

@Entity()
export class CommentLikes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user: Users) => user.comments)
  public user: Users;

  @ManyToOne(() => Comments, (comment: Comments) => comment.likes)
  public comment: Comments;
}