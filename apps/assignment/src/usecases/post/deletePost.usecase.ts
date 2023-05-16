import { PostRepository } from '../../domain/interface/PostRepository';

export class DeletePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(id: number): Promise<void> {
    return await this.postRepository.deletePost(id);
  }
}
