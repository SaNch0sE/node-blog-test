import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';
import { ArticleDTO } from 'src/dto/article.dto';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @Get('articles')
    async getArticles(@Res() res: Response): Promise<void> {
        const articles = await this.blogService.getArticles();
        res.json(articles);
    }

    @Post('new/article')
    async newArticle(@Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        const articles = await this.blogService.newArticle(body);
        res.json(articles);
    }
}
