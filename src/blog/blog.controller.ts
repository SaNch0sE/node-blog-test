import { Controller, Get, Res, Post, Body, Param } from '@nestjs/common';
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

    @Get('articles/user/:user_id')
    async getUserArticles(@Res() res: Response, @Param() params: { user_id: number }): Promise<void> {
        const user_articles = await this.blogService.getUserArticles(params.user_id);
        res.json(user_articles);
    }

    @Post('new/article')
    async newArticle(@Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        const article = await this.blogService.newArticle(body);
        res.json(article);
    }

    @Post('update/article')
    async updateArticle(@Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        const article = await this.blogService.updateArticle(body);
        res.json(article);
    }

    @Post('remove/article')
    async removeArticle(@Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        const article = await this.blogService.removeArticle(body);
        res.json(article);
    }
}
