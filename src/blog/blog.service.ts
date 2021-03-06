import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Articles from 'src/entities/article.entity';
import ArticleDTO from 'src/dto/article.dto';
import Users from 'src/entities/user.entity';
import Comments from 'src/entities/comment.entity';
import CommentDTO from 'src/dto/comment.dto';
import ArticleLikes from 'src/entities/articleLike.entity';
import CommentLikes from 'src/entities/commentLike.entity';

@Injectable()
export default class BlogService {
  constructor(
    @InjectRepository(Articles)
    private articlesRepository: Repository<Articles>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(ArticleLikes)
    private articleLikesRepository: Repository<ArticleLikes>,
    @InjectRepository(CommentLikes)
    private commentLikesRepository: Repository<CommentLikes>,
  ) { }

  // Blog services
  getArticle(id: number): Promise<Articles> {
    return this.articlesRepository
      .createQueryBuilder('articles')
      .select([
        'articles.title',
        'articles.created_at',
        'users.id',
        'users.full_name',
        'articles.content',
      ])
      .leftJoin('articles.likes', 'article_likes')
      .loadRelationCountAndMap('articles.likes', 'articles.likes')
      .leftJoin('articles.author', 'users')
      .where({ id })
      .getOne();
  }

  getArticles(): Promise<Articles[]> {
    return this.articlesRepository
      .createQueryBuilder('articles')
      .leftJoin('articles.likes', 'article_likes')
      .loadRelationCountAndMap('articles.likes', 'articles.likes')
      .leftJoinAndMapOne('articles.author', 'articles.author', 'users.full_name')
      .getMany();
  }

  getUserArticles(id: number): Promise<Articles[]> {
    return this.articlesRepository.find({ where: { author: { id } } });
  }

  async newArticle(body: ArticleDTO): Promise<Articles | { error: string }> {
    const user = await this.usersRepository.findOne(body.user_id);
    if (user) {
      const article = new Articles();
      article.author = user;
      article.title = body.title;
      article.content = body.content;

      return this.articlesRepository.save(article);
    }
    return { error: 'No user with this id' };
  }

  updateArticle(body: ArticleDTO): Promise<UpdateResult> {
    const article = new Articles();
    article.title = body.title;
    article.content = body.content;
    return this.articlesRepository.update({ id: body.id }, article);
  }

  async removeArticle(body: ArticleDTO): Promise<Articles> {
    const article = await this.articlesRepository.findOne(body.id);
    return this.articlesRepository.remove(article);
  }

  // Comments services
  getComments(id: number): Promise<Comments[]> {
    return this.commentsRepository
      .createQueryBuilder('comments')
      .leftJoin('comments.likes', 'comment_likes')
      .loadRelationCountAndMap('comments.likes', 'comments.likes')
      .where({ article: { id } })
      .printSql()
      .getMany();
  }

  async newComment(body: CommentDTO): Promise<Comments | { error: string }> {
    const user = await this.usersRepository.findOne(body.user_id);
    const article = await this.articlesRepository.findOne(body.article_id);
    if (user && article) {
      const comment = new Comments();
      comment.text = body.text;
      comment.author = user;
      comment.article = article;

      return this.commentsRepository.save(comment);
    }
    return { error: 'Wrong creditionals' };
  }

  // Likes servives
  async addLike(body: ArticleDTO): Promise<ArticleLikes | { error: string }> {
    const user = await this.usersRepository.findOne(body.user_id);
    const article = await this.articlesRepository.findOne(body.id);
    if (user && article) {
      const articleLike = new ArticleLikes();
      articleLike.article = article;
      articleLike.user = user;

      return this.articleLikesRepository.save(articleLike);
    }
    return { error: 'No user with this id or invalid article' };
  }

  async disLike(body: ArticleDTO): Promise<ArticleLikes | null> {
    const article = await this.articlesRepository.findOne(body.id);
    const user = await this.usersRepository.findOne(body.user_id);
    const artLike = await this.articleLikesRepository.findOne({
      where: { user, article },
    });
    let result: ArticleLikes = null;
    if (artLike) {
      result = await this.articleLikesRepository.remove(artLike);
    }
    return result;
  }

  async CommentLike(
    body: CommentDTO,
  ): Promise<CommentLikes | { error: string }> {
    const user = await this.usersRepository.findOne(body.user_id);
    const comment = await this.commentsRepository.findOne(body.id);
    if (user && comment) {
      const commentLike = new CommentLikes();
      commentLike.comment = comment;
      commentLike.user = user;

      return this.commentLikesRepository.save(commentLike);
    }
    return { error: 'No user with this id or invalid article' };
  }
}
