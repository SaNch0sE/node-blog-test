import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Render,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import ArticleDTO from 'src/dto/article.dto';
import CommentDTO from 'src/dto/comment.dto';
import UserDTO from 'src/dto/user.dto';
import Articles from 'src/entities/article.entity';
import BlogService from './blog.service';

@Controller('blog')
export default class BlogController {
  constructor(private readonly blogService: BlogService) {}

  /*
  //// View calls
  */
  @UseGuards(AuthGuard('jwt'))
  @Get('article/:id')
  async getArticle(
    @Res() res: Response,
    @Param() params: { id: number },
  ): Promise<void> {
    const article: Articles = await this.blogService.getArticle(params.id);
    if (article) {
      res.render('article', { article });
    } else {
      res.render('articleDoNotExist');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('articles')
  @Render('articles')
  async getArticles(): Promise<{ articles: Articles[] }> {
    const articles: Articles[] = await this.blogService.getArticles();
    return { articles };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('articles/user/:user_id')
  @Render('user_article')
  async getUserArticles(
    @Param() params: { user_id: number },
  ): Promise<Articles[]> {
    const user_articles: Articles[] = await this.blogService.getUserArticles(
      params.user_id,
    );
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
  async commentArticle(
    @Body() body: CommentDTO,
    @Res() res: Response,
    @Param() params: { id: number },
  ): Promise<void> {
    const comment: CommentDTO = body;
    comment.article_id = params.id;
    const article = await this.blogService.newComment(comment);
    res.json(article);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create/article')
  async apiCreateArticle(
    @Req() req: { user: UserDTO },
    @Body() body: ArticleDTO,
    @Res() res: Response,
  ): Promise<void> {
    const articleDto: ArticleDTO = body;
    articleDto.user_id = req.user.id;
    const article = await this.blogService.newArticle(articleDto);
    res.json(article);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/article')
  async apiUpdateArticle(
    @Req() req: { user: UserDTO },
    @Body() body: ArticleDTO,
    @Res() res: Response,
  ): Promise<void> {
    const articleDto: ArticleDTO = body;
    articleDto.user_id = req.user.id;
    const article = await this.blogService.updateArticle(articleDto);
    res.json(article);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove/article')
  async apiRemoveArticle(
    @Req() req: { user: UserDTO },
    @Body() body: ArticleDTO,
    @Res() res: Response,
  ): Promise<void> {
    const articleDto: ArticleDTO = body;
    articleDto.user_id = req.user.id;
    const article = await this.blogService.removeArticle(articleDto);
    res.json(article);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('article/:id/comments/all')
  async apiGetComments(
    @Res() res: Response,
    @Param() params: { id: number },
  ): Promise<void> {
    const article = await this.blogService.getComments(params.id);
    res.json(article);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('article/:id/comments/new')
  async apiCommentArticle(
    @Req() req: { user: UserDTO },
    @Body() body: CommentDTO,
    @Res() res: Response,
    @Param() params: { id: number },
  ): Promise<void> {
    const commentDto: CommentDTO = body;
    commentDto.user_id = req.user.id;
    const article = await this.blogService.newComment(commentDto);
    res.json(article);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('article/:id/liked')
  async addArticleLike(
    @Req() req: { user: UserDTO },
    @Body() body: ArticleDTO,
    @Res() res: Response,
    @Param() params: { id: number },
  ): Promise<void> {
    const articleDto: ArticleDTO = body;
    articleDto.user_id = req.user.id;
    articleDto.id = params.id;
    const article = await this.blogService.addLike(articleDto);
    res.json(article);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('article/:id/comments/:cid/liked')
  async commentLike(
    @Req() req: { user: UserDTO },
    @Body() body: CommentDTO,
    @Res() res: Response,
    @Param() params: { id: number; cid: number },
  ): Promise<void> {
    const commentDto: CommentDTO = body;
    commentDto.user_id = req.user.id;
    commentDto.id = params.cid;
    const comment = await this.blogService.CommentLike(commentDto);
    res.json(comment);
  }
}
