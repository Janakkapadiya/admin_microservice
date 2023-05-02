import { PostM } from '../model/PostsM';

export interface PostRepository {
  createPost(user: number, data: PostM): Promise<PostM>;
  getAllPosts(): Promise<PostM[]>;
  getPost(userId: number): Promise<PostM>;
  deletePost(userId: number): Promise<void>;
}
