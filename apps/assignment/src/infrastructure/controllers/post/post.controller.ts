import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { PostsPresenter } from './post.presenter';
import { Role } from '@app/shared/domain/enums/Roles.enum';
import { CreatePostUseCase } from 'apps/assignment/src/usecases/post/createPost.usecase';
import { GetAllPostUseCase } from 'apps/assignment/src/usecases/post/getAllPost.usecase';
import { GetPostUseCase } from 'apps/assignment/src/usecases/post/getPost.usecase';
import { UseCaseProxy } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { RoleGuard, Roles } from '@app/shared';
import { CreatePostDto } from './post.dto';
import { JwtAuthGuard } from 'apps/auth/src/infrastructure/common/guards/jwtAuth.guard';

@Controller('post')
@ApiTags('post')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(PostsPresenter)
export class PostController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_POST_USECASES_PROXY)
    private readonly createUserPost: UseCaseProxy<CreatePostUseCase>,
    @Inject(UsecasesProxyModule.GET_POSTS_USECASES_PROXY)
    private readonly getAllPosts: UseCaseProxy<GetAllPostUseCase>,
    @Inject(UsecasesProxyModule.GET_POST_USECASES_PROXY)
    private readonly getUserPost: UseCaseProxy<GetPostUseCase>,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.User)
  async createPost(@Body() createPostDto: CreatePostDto, @Req() request: any) {
    const post = await this.createUserPost
      .getInstance()
      .execute(request.user.id, createPostDto);
    console.log('post entity user relation ->', post);
    return post;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.User)
  async getPost(@Param('id') id: number) {
    const post = await this.getUserPost.getInstance().execute(id);
    return post;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.User)
  async getAllPost() {
    const post = await this.getAllPosts.getInstance().execute();
    return post;
  }
}
