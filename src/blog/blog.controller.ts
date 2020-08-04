import { Controller, Get, Res, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';
import { ArticleDTO } from 'src/dto/article.dto';
import { CommentDTO } from 'src/dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDTO } from 'src/dto/user.dto';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('article/:id')
    async getArticle(@Res() res: Response, @Param() params: { id: number }): Promise<void> {
        const article = await this.blogService.getArticle(params.id);
        res.json(article);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('articles')
    async getArticles(@Res() res: Response): Promise<void> {
        const articles = await this.blogService.getArticles();
        res.json(articles);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('articles/user/:user_id')
    async getUserArticles(@Res() res: Response, @Param() params: { user_id: number }): Promise<void> {
        const user_articles = await this.blogService.getUserArticles(params.user_id);
        res.json(user_articles);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('new/article')
    async newArticle(@Req() req: { user: UserDTO }, @Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        body.user_id = req.user.id;
        const article = await this.blogService.newArticle(body);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('update/article')
    async updateArticle(@Req() req: { user: UserDTO }, @Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        body.user_id = req.user.id;
        const article = await this.blogService.updateArticle(body);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('remove/article')
    async removeArticle(@Req() req: { user: UserDTO }, @Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        body.user_id = req.user.id;
        const article = await this.blogService.removeArticle(body);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('article/:id/comments/all')
    async getComments(@Res() res: Response, @Param() params: { id: number }): Promise<void> {
        const article = await this.blogService.getComments(params.id);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('article/:id/comments/new')
    async commentArticle(@Req() req: { user: UserDTO }, @Body() body: CommentDTO, @Res() res: Response, @Param() params: { id: number }): Promise<void> {
        body.article_id = params.id;
        const article = await this.blogService.newComment(body);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('article/:id/liked')
    async addArticleLike(@Req() req: { user: UserDTO }, @Body() body: ArticleDTO, @Res() res: Response, @Param() params: { id: number }): Promise<void> {
        body.id = params.id;
        body.user_id = req.user.id;
        const article = await this.blogService.addLike(body);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('article/:id/comments/:cid/liked')
    async commentLike(@Req() req: { user: UserDTO }, @Body() body: CommentDTO, @Res() res: Response, @Param() params: { id: number, cid: number }): Promise<void> {
        body.user_id = req.user.id;
        body.id = params.cid;
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
