import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DatabasePostRepository } from './post.repository';
import { DatabaseUserRepository } from './user.repository';
import { Posts } from '../entities/posts.entity';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Posts, User])],
  providers: [DatabasePostRepository, DatabaseUserRepository],
  exports: [DatabasePostRepository, DatabaseUserRepository],
})
export class RepositoriesModule {}
