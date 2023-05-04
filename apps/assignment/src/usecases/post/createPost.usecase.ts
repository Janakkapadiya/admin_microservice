import { ILogger } from '@app/shared';
import { PostRepository } from '../../domain/interface/PostRepository';
import { PostM } from '../../domain/model/PostsM';

export class CreatePostUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly postRepository: PostRepository,
  ) {}

  async execute(userId: number, post: PostM): Promise<PostM> {
    const result = await this.postRepository.createPost(userId, post);
    this.logger.log('addTodoUseCases execute', 'New todo have been inserted');
    return result;
  }
}
