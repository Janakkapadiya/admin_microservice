import {
  LoggerModule,
  BcryptModule,
  ExceptionsModule,
  MailerModule,
  LoggerService,
  BcryptService,
  ExceptionsService,
  MailerService,
  JwtTokenService,
  JwtModule,
} from '@app/shared';
import { Module, DynamicModule } from '@nestjs/common';
import { IsAuthenticatedUseCases } from '../../usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from '../../usecases/auth/login.usecases';
import { LogoutUseCases } from '../../usecases/auth/logout.usecases';
import { RegisterUseCases } from '../../usecases/auth/register.user.usecase';
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
import { EnvironmentConfigService } from '../../../../../libs/shared/src/infrastructure/config/environment-config/environment-config.service';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    MailerModule,
  ],
})
export class UsecasesProxyModule {
  // Auth
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  static GET_POST_USECASES_PROXY = 'getPostUsecasesProxy';
  static GET_POSTS_USECASES_PROXY = 'getPostsUsecasesProxy';
  static CREATE_POST_USECASES_PROXY = 'createPostUsecasesProxy';
  static DELETE_POST_USECASES_PROXY = 'deletePostUsecasesProxy';

  static GET_USERS_USECASES_PROXY = 'deleteUserUsecasesProxy';
  static GET_USER_BY_ID_USECASES_PROXY = 'deleteUserUsecasesProxy';
  // signup
  static CREATE_USER_USECASES_PROXY = 'createUserUsecasesProxy';

  static REGISTER_USER_USECASES_PROXY = 'registerUserTestCasesProxy';

  //update password
  static UPDATE_USER_PASSWORD_USECASES_PROXY = 'updateUserPasswordProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            DatabaseUserRepository,
            BcryptService,
            ExceptionsService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
            exception: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                logger,
                jwtTokenService,
                config,
                userRepo,
                bcryptService,
                exception,
              ),
            ),
        },
        {
          inject: [DatabaseUserRepository, ExceptionsService],
          provide: UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            exception: ExceptionsService,
          ) =>
            new UseCaseProxy(new IsAuthenticatedUseCases(userRepo, exception)),
        },
        {
          inject: [],
          provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: () => new UseCaseProxy(new LogoutUseCases()),
        },
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
          inject: [DatabaseUserRepository, ExceptionsService, BcryptService],
          provide: UsecasesProxyModule.REGISTER_USER_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            exception: ExceptionsService,
            bycrypt: BcryptService,
          ) =>
            new UseCaseProxy(
              new RegisterUseCases(userRepository, exception, bycrypt),
            ),
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
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,
        // **********
        UsecasesProxyModule.CREATE_USER_USECASES_PROXY,
        UsecasesProxyModule.GET_USERS_USECASES_PROXY,
        UsecasesProxyModule.GET_USER_BY_ID_USECASES_PROXY,
        UsecasesProxyModule.REGISTER_USER_USECASES_PROXY,
        // ************
        UsecasesProxyModule.UPDATE_USER_PASSWORD_USECASES_PROXY,
      ],
    };
  }
}
