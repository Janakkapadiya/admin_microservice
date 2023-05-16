import {
  LoggerModule,
  ExceptionsModule,
  MailerModule,
  LoggerService,
  ExceptionsService,
  MailerService,
} from '@app/shared';
import { Module, DynamicModule } from '@nestjs/common';
import { CreatePostUseCase } from '../../usecases/post/createPost.usecase';
import { DeletePostUseCase } from '../../usecases/post/deletePost.usecase';
import { GetAllPostUseCase } from '../../usecases/post/getAllPost.usecase';
import { GetPostUseCase } from '../../usecases/post/getPost.usecase';
import { getUsersUseCases } from '../../usecases/user/all.user.usecase';
import { CreateUserUseCase } from '../../usecases/user/create.user.usecase';
import { getUserByIdUseCases } from '../../usecases/user/getById.user.usecase';
import { UpdateUserPasswordUseCase } from '../../usecases/user/update.password.usecase';
import { DatabasePostRepository } from '../repositories/post.repository';
import { RepositoriesModule } from '../repositories/repositories.module';
import { DatabaseUserRepository } from '../repositories/user.repository';
import { UseCaseProxy } from './usecases-proxy';
import { EnvironmentConfigModule } from '../../../../../libs/shared/src/infrastructure/config/environment-config/environment-config.module';
import { BcryptService } from 'apps/auth/src/infrastructure/services/bcrypt/bcrypt.service';
import { AuthModule } from '../../../../auth/src/auth.module';
import { BcryptModule } from '../../../../auth/src/infrastructure/services/bcrypt/bcrypt.module';

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    MailerModule,
    AuthModule,
    BcryptModule,
  ],
})
export class UsecasesProxyModule {
  static GET_POST_USECASES_PROXY = 'getPostUsecasesProxy';
  static GET_POSTS_USECASES_PROXY = 'getPostsUsecasesProxy';
  static CREATE_POST_USECASES_PROXY = 'createPostUsecasesProxy';
  static DELETE_POST_USECASES_PROXY = 'deletePostUsecasesProxy';

  static GET_USERS_USECASES_PROXY = 'deleteUserUsecasesProxy';
  static GET_USER_BY_ID_USECASES_PROXY = 'deleteUserUsecasesProxy';
  // signup
  static CREATE_USER_USECASES_PROXY = 'createUserUsecasesProxy';
  //update password
  static UPDATE_USER_PASSWORD_USECASES_PROXY = 'updateUserPasswordProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [DatabasePostRepository],
          provide: UsecasesProxyModule.GET_POST_USECASES_PROXY,
          useFactory: (postRepository: DatabasePostRepository) =>
            new UseCaseProxy(new GetPostUseCase(postRepository)),
        },
        {
          inject: [DatabasePostRepository],
          provide: UsecasesProxyModule.GET_POSTS_USECASES_PROXY,
          useFactory: (postRepository: DatabasePostRepository) =>
            new UseCaseProxy(new GetAllPostUseCase(postRepository)),
        },
        {
          inject: [LoggerService, DatabasePostRepository],
          provide: UsecasesProxyModule.CREATE_POST_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            postRepository: DatabasePostRepository,
          ) => new UseCaseProxy(new CreatePostUseCase(logger, postRepository)),
        },
        {
          inject: [DatabasePostRepository],
          provide: UsecasesProxyModule.DELETE_POST_USECASES_PROXY,
          useFactory: (postRepository: DatabasePostRepository) =>
            new UseCaseProxy(new DeletePostUseCase(postRepository)),
        },
        {
          inject: [DatabaseUserRepository, ExceptionsService, MailerService],
          provide: UsecasesProxyModule.CREATE_USER_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            exceptionsService: ExceptionsService,
            emailSendService: MailerService,
          ) =>
            new UseCaseProxy(
              new CreateUserUseCase(
                userRepository,
                exceptionsService,
                emailSendService,
              ),
            ),
        },
        {
          inject: [DatabaseUserRepository],
          provide: UsecasesProxyModule.GET_USERS_USECASES_PROXY,
          useFactory: (userRepository: DatabaseUserRepository) =>
            new UseCaseProxy(new getUsersUseCases(userRepository)),
        },
        {
          inject: [DatabaseUserRepository, ExceptionsService],
          provide: UsecasesProxyModule.GET_USER_BY_ID_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            exception: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new getUserByIdUseCases(userRepository, exception),
            ),
        },

        // update password
        {
          inject: [DatabaseUserRepository, ExceptionsService, BcryptService],
          provide: UsecasesProxyModule.UPDATE_USER_PASSWORD_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            exception: ExceptionsService,
            bcrypt: BcryptService,
          ) =>
            new UseCaseProxy(
              new UpdateUserPasswordUseCase(userRepository, exception, bcrypt),
            ),
        },
      ],

      exports: [
        UsecasesProxyModule.GET_POST_USECASES_PROXY,
        UsecasesProxyModule.GET_POSTS_USECASES_PROXY,
        UsecasesProxyModule.CREATE_POST_USECASES_PROXY,
        UsecasesProxyModule.DELETE_POST_USECASES_PROXY,
        // **********
        UsecasesProxyModule.CREATE_USER_USECASES_PROXY,
        UsecasesProxyModule.GET_USERS_USECASES_PROXY,
        UsecasesProxyModule.GET_USER_BY_ID_USECASES_PROXY,
        // ************
        UsecasesProxyModule.UPDATE_USER_PASSWORD_USECASES_PROXY,
      ],
    };
  }
}
