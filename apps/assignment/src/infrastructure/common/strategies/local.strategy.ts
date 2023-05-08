import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { LoginUseCases } from 'apps/assignment/src/usecases/auth/login.usecases';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy';
import { ExceptionsService } from '@app/shared';
import { LoggerService } from '@app/shared/infrastructure/logger/logger.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    @Inject('IException')
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
