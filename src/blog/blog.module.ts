import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entity';
import { Articles } from 'src/entities/article.entity';
import { Comments } from 'src/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Articles, Comments])],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
