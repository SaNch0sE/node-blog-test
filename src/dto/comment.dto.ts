import { IsNotEmpty } from 'class-validator';

export class CommentDTO {
    @IsNotEmpty()
    id?: number;

    @IsNotEmpty()
    text: string;

    @IsNotEmpty()
    likes?: number;
  
    @IsNotEmpty()
    created_at?: Date;

    @IsNotEmpty()
    user_id?: number;

    @IsNotEmpty()
    article_id?: number;
  }