import { IsNotEmpty } from 'class-validator';
import { Users } from 'src/entities/user.entity';
import { Comments } from 'src/entities/comment.entity';

export class ArticleDTO {
    @IsNotEmpty()
    id: number;
  
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    likes: number;
  
    @IsNotEmpty()
    created_at: Date;

    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    author?: Users;

    @IsNotEmpty()
    comments?: Comments[];
  }