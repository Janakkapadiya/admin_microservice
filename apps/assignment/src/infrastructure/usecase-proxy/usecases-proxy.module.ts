import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '@app/shared/infrastructure/config/environment-config/environment-config.module';
import { DatabasePostRepository } from 'apps/assignment/src/infrastructure/repositories/post.repository';
import { RepositoriesModule } from 'apps/assignment/src/infrastructure/repositories/repositories.module';
import { BcryptModule } from '@app/shared/infrastructure/services/bcrypt/bcrypt.module';
import { IsAuthenticatedUseCases } from 'apps/assignment/src/usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from 'apps/assignment/src/usecases/auth/login.usecases';
import { LogoutUseCases } from 'apps/assignment/src/usecases/auth/logout.usecases';
import { getUsersUseCases } from 'apps/assignment/src/usecases/user/all.user.usecase';
import { UseCaseProxy } from './usecases-proxy';
import { RegisterUseCases } from 'apps/assignment/src/usecases/auth/register.user.usecase';
import { CreatePostUseCase } from 'apps/assignment/src/usecases/post/createPost.usecase';
import { GetAllPostUseCase } from 'apps/assignment/src/usecases/post/getAllPost.usecase';
import { DeletePostUseCase } from 'apps/assignment/src/usecases/post/deletePost.usecase';
import { GetPostUseCase } from 'apps/assignment/src/usecases/post/getPost.usecase';
import { CreateUserUseCase } from 'apps/assignment/src/usecases/user/create.user.usecase';
import { UpdateUserPasswordUseCase } from 'apps/assignment/src/usecases/user/update.password.usecase';
import { getUserByIdUseCases } from 'apps/assignment/src/usecases/user/getById.user.usecase';
import { JwtModule } from '@app/shared/infrastructure/services/jwt/jwt.module';
import { EnvironmentConfigService } from '@app/shared/infrastructure/config/environment-config/environment-config.service';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { LoggerService } from '@app/shared/infrastructure/logger/logger.service';
import { BcryptService } from '@app/shared/infrastructure/services/bcrypt/bcrypt.service';
import { JwtTokenService } from '@app/shared/infrastructure/services/jwt/jwt.service';
import { MailerModule } from '@app/shared/infrastructure/services/mail/mail.module';
import { MailerService } from '@app/shared/infrastructure/services/mail/mailer.service';
import { DatabaseUserRepository } from '../repositories/user.repository';

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
