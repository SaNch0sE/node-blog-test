import { IsNotEmpty } from 'class-validator';
import { Comments } from 'src/entities/comment.entity';
import { Articles } from 'src/entities/article.entity';

export class UserDTO {
    @IsNotEmpty()
    id: number;
  
    @IsNotEmpty()
    full_name: string;

    @IsNotEmpty()
    login: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    articles?: Articles[];

    @IsNotEmpty()
    comments?: Comments[];
  }