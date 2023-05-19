import { ExceptionsService } from './../../../../../../libs/shared/src/infrastructure/exceptions/exceptions.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UseCaseProxy } from '../../usecase-proxy/usecases-proxy';
import { LoginUseCases } from 'apps/auth/src/usecases/auth/login.usecases';
import { AuthUsecasesProxyModule } from '../../usecase-proxy/usecases-proxy.module';
import { LoggerService } from './../../../../../../libs/shared/src/infrastructure/logger/logger.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthUsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super();
  }

  async validate(email: string, password: string) {
    if (!email || !password) {
      this.logger.warn(
        'LocalStrategy',
        `email or password is missing, BadRequestException`,
      );
      this.exceptionService.UnauthorizedException();
    }
    const user = await this.loginUsecaseProxy
      .getInstance()
      .validateUserForLocalStragtegy(email, password);
    if (!user) {
      this.logger.warn('LocalStrategy', `Invalid email or password`);
      this.exceptionService.UnauthorizedException({
        message: 'Invalid email or password.',
      });
    }
    return user;
  }
}
