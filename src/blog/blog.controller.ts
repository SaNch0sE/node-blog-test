import { Controller, Get, Res, Post, Body, Param, UseGuards, Req, Render } from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';
import { ArticleDTO } from 'src/dto/article.dto';
import { CommentDTO } from 'src/dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDTO } from 'src/dto/user.dto';
import { Articles } from 'src/entities/article.entity';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}
    /*
    //// View calls
    */
    @UseGuards(AuthGuard('jwt'))
    @Get('article/:id')
    @Render('article')
    async getArticle(@Res() res: Response, @Param() params: { id: number }): Promise<{ article: Articles }> {
        const article: Articles = await this.blogService.getArticle(params.id);
        return { article };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('articles')
    @Render('articles')
    async getArticles(): Promise<Articles[]> {
        const articles: Articles[] = await this.blogService.getArticles();
        return articles;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('articles/user/:user_id')
    @Render('user_article')
    async getUserArticles(@Param() params: { user_id: number }): Promise<Articles[]> {
        const user_articles: Articles[] = await this.blogService.getUserArticles(params.user_id);
        return user_articles;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('create/article')
    @Render('new_article')
    createArticle(): null {
        return null;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('update/article')
    @Render('update_article')
    updateArticle(): null {
        return null;
    }
    /*
    //// Api calls
    */
    @UseGuards(AuthGuard('jwt'))
    @Post('article/:id/comments/new')
    async commentArticle(@Req() req: { user: UserDTO }, @Body() body: CommentDTO, @Res() res: Response, @Param() params: { id: number }): Promise<void> {
        body.article_id = params.id;
        const article = await this.blogService.newComment(body);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create/article')
    async apiCreateArticle(@Req() req: { user: UserDTO }, @Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        body.user_id = req.user.id;
        const article = await this.blogService.newArticle(body);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('update/article')
    async apiUpdateArticle(@Req() req: { user: UserDTO }, @Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        body.user_id = req.user.id;
        const article = await this.blogService.updateArticle(body);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('remove/article')
    async apiRemoveArticle(@Req() req: { user: UserDTO }, @Body() body: ArticleDTO, @Res() res: Response): Promise<void> {
        body.user_id = req.user.id;
        const article = await this.blogService.removeArticle(body);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('article/:id/comments/all')
    async apiGetComments(@Res() res: Response, @Param() params: { id: number }): Promise<void> {
        const article = await this.blogService.getComments(params.id);
        res.json(article);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('article/:id/comments/new')
    async apiCommentArticle(@Req() req: { user: UserDTO }, @Body() body: CommentDTO, @Res() res: Response, @Param() params: { id: number }): Promise<void> {
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
