import { IsNotEmpty } from 'class-validator';

export class CommentDTO {
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
    author: number;

    @IsNotEmpty()
    article: number;
  }