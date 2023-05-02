import { ApiProperty } from '@nestjs/swagger';
import { PostM } from 'apps/assignment/src/domain/model/PostsM';

export class PostsPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;

  constructor(post: PostM) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
  }
}
