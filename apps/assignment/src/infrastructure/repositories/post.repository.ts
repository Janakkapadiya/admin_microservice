import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostRepository } from '../../domain/interface/PostRepository';
import { PostM } from '../../domain/model/PostsM';
import { Posts } from '../entities/posts.entity';

@Injectable()
export class DatabasePostRepository implements PostRepository {
  constructor(
    @InjectRepository(Posts)
    private readonly todoEntityRepository: Repository<Posts>,
  ) {}

  async createPost(user: number, data: PostM): Promise<PostM> {
    const post = new Posts();
    post.userId = user;
    Object.assign(post, data);
    this.todoEntityRepository.create(post);
    const result = await this.todoEntityRepository.save(post);
    console.log(result);
    return this.toPostsM(result);
  }

  async getAllPosts(): Promise<PostM[]> {
    const todoEntity = await this.todoEntityRepository.find();
    console.log(todoEntity);
    const repl = todoEntity.map((todoEntity) => this.toPostsM(todoEntity));
    console.log('getAllPosts repl -> ', repl);
    return repl;
  }

  async getPost(userId: number): Promise<PostM> {
    const todoEntity = await this.todoEntityRepository.findOne({
      where: {
        id: userId,
      },
    });
    return this.toPostsM(todoEntity);
  }

  async deletePost(userId: number): Promise<void> {
    await this.todoEntityRepository.delete({ id: userId });
  }

  private toPostsM(todoEntity: Posts): PostM {
    const todo: PostM = new PostM();

    todo.id = todoEntity.id;
    todo.title = todoEntity.title;
    todo.content = todoEntity.content;

    return todo;
  }
}
