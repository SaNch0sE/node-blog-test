import { Injectable } from '@nestjs/common';
import { Articles } from 'src/entities/article.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleDTO } from 'src/dto/article.dto';
import { Users } from 'src/entities/user.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Articles) private articlesRepository: Repository<Articles>, 
        @InjectRepository(Users) private usersRepository: Repository<Users>
    ) {}

    getArticles(): Promise<Articles[]> {
        return this.articlesRepository.find();
    }

    getUserArticles(id: number): Promise<Articles[]> {
        return this.articlesRepository.find({ where: { author: { id } } });
    }

    async newArticle(body: ArticleDTO): Promise<Articles | { error: string }> {
        const user = await this.usersRepository.findOne(body.user_id);
        if (user) {
            const article = new Articles;
            article.author = user;
            article.title = body.title;
            article.content = body.content;

            return this.articlesRepository.save(article);
        }
        return { error: 'No user with this id' };
    }

    updateArticle(body: ArticleDTO): Promise<UpdateResult> {
        const article = new Articles;
        article.title = body.title;
        article.content = body.content;
        return this.articlesRepository.update({ id: body.id }, article);
    }

    async removeArticle(body: ArticleDTO): Promise<Articles> {
        const article = await this.articlesRepository.findOne(body.id);
        return this.articlesRepository.remove(article);
    }
}
