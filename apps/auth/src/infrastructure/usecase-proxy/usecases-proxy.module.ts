import {
  LoggerModule,
  ExceptionsModule,
  MailerModule,
  LoggerService,
  ExceptionsService,
} from '@app/shared';
import { Module, DynamicModule } from '@nestjs/common';
import { IsAuthenticatedUseCases } from '../../usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from '../../usecases/auth/login.usecases';
import { LogoutUseCases } from '../../usecases/auth/logout.usecases';
import { RegisterUseCases } from '../../usecases/auth/register.user.usecase';
import { UseCaseProxy } from './usecases-proxy';
import { EnvironmentConfigModule } from '../../../../../libs/shared/src/infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../../../../../libs/shared/src/infrastructure/config/environment-config/environment-config.service';
import { JwtModule } from '../services/jwt/jwt.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { RepositoriesModule } from 'apps/assignment/src/infrastructure/repositories/repositories.module';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { DatabaseUserRepository } from 'apps/assignment/src/infrastructure/repositories/user.repository';
import { BcryptService } from '../services/bcrypt/bcrypt.service';

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
export class AuthUsecasesProxyModule {
  // Auth
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';
  static REGISTER_USER_USECASES_PROXY = 'registerUserTestCasesProxy';

  static register(): DynamicModule {
    return {
      module: AuthUsecasesProxyModule,
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
          provide: AuthUsecasesProxyModule.LOGIN_USECASES_PROXY,
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
          inject: [DatabaseUserRepository],
          provide: AuthUsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new IsAuthenticatedUseCases(userRepo)),
        },
        {
          inject: [],
          provide: AuthUsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: () => new UseCaseProxy(new LogoutUseCases()),
        },
        {
          inject: [DatabaseUserRepository, ExceptionsService, BcryptService],
          provide: AuthUsecasesProxyModule.REGISTER_USER_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseUserRepository,
            exception: ExceptionsService,
            bycrypt: BcryptService,
          ) =>
            new UseCaseProxy(
              new RegisterUseCases(userRepository, exception, bycrypt),
            ),
        },
      ],

      exports: [
        AuthUsecasesProxyModule.LOGIN_USECASES_PROXY,
        AuthUsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
        AuthUsecasesProxyModule.LOGOUT_USECASES_PROXY,
        AuthUsecasesProxyModule.REGISTER_USER_USECASES_PROXY,
      ],
    };
  }
}
