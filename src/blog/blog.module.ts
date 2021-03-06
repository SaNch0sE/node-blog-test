import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/entities/user.entity';
import Articles from 'src/entities/article.entity';
import Comments from 'src/entities/comment.entity';
import ArticleLikes from 'src/entities/articleLike.entity';
import CommentLikes from 'src/entities/commentLike.entity';
import BlogService from './blog.service';
import BlogController from './blog.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Articles,
      Comments,
      ArticleLikes,
      CommentLikes,
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export default class BlogModule {}
