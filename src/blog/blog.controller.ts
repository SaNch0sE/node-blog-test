import { Controller, Get, Res, Post, Body, Param } from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';
import { ArticleDTO } from 'src/dto/article.dto';
import { CommentDTO } from 'src/dto/comment.dto';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @Get('article/:id')
    async getArticle(@Res() res: Response, @Param() params: { id: number }): Promise<void> {
        const article = await this.blogService.getArticle(params.id);
        res.json(article);
    }

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

    @Get('article/:id/comments/all')
    async getComments(@Res() res: Response, @Param() params: { id: number }): Promise<void> {
        const article = await this.blogService.getComments(params.id);
        res.json(article);
    }

    @Post('article/:id/comments/new')
    async commentArticle(@Body() body: CommentDTO, @Res() res: Response, @Param() params: { id: number }): Promise<void> {
        body.article_id = params.id;
        const article = await this.blogService.newComment(body);
        res.json(article);
    }

    @Post('article/:id/liked')
    async addArticleLike(@Body() body: ArticleDTO, @Res() res: Response, @Param() params: { id: number }): Promise<void> {
        body.id = params.id;
        const article = await this.blogService.addLike(body);
        res.json(article);
    }

    @Post('article/:id/comments/:cid/liked')
    async commentLike(@Body() body: CommentDTO, @Res() res: Response, @Param() params: { id: number, cid: number }): Promise<void> {
        body.article_id = params.id;
        body.user_id = params.cid;
        const article = await this.blogService.CommentLike(body);
        res.json(article);
    }

    // @Get('article/:id/likes')
    // async getArticleLikes(@Res() res: Response, @Param() params: { id: number }): Promise<void> {
    //     const article = await this.blogService.getArticleLikes(params.id);
    //     res.json(article);
    // }

    // @Get('article/:id/comments/:cid/likes')
    // async getCommentLikes(@Res() res: Response, @Param() params: { id: number }): Promise<void> {
    //     const article = await this.blogService.getCommentLikes(params.id);
    //     res.json(article);
    // }
}
