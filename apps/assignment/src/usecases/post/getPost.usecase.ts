import { PostRepository } from '../../domain/interface/PostRepository';
import { PostM } from '../../domain/model/PostsM';

export class GetPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(id: number): Promise<PostM> {
    return await this.postRepository.getPost(id);
  }
}
