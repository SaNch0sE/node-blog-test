import { Injectable } from '@nestjs/common';
import { Articles } from 'src/entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleDTO } from 'src/dto/article.dto';
import { Users } from 'src/entities/user.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Articles) private articlesRepository: Repository<Articles>, 
        @InjectRepository(Users) private usersRepository: Repository<Users>) {}

    getArticles(): Promise<Articles[]> {
        return this.articlesRepository.find();
    }

    async newArticle(article: ArticleDTO): Promise<Articles> {
        const user = await this.usersRepository.findOne(article.user_id);

        const narticle = article;
        article.author = user;
        delete article.user_id;

        const created_article = await this.articlesRepository.create(narticle);
        return this.articlesRepository.save(created_article);
    }
}
