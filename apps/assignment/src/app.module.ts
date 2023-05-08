import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { SharedModule } from '@app/shared/rmq/rmqmodule';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { BcryptModule } from '../../../libs/shared/src/infrastructure/services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from '../../../libs/shared/src/infrastructure/services/jwt/jwt.module';
import { MailerModule } from '../../../libs/shared/src/infrastructure/services/mail/mail.module';
import { AppService } from './app.service';
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy';
import { ControllersModule } from './infrastructure/controllers/controllers.module';

import { ExceptionsService, LoggerService } from '@app/shared';
import { EnvironmentConfigModule } from '../../../libs/shared/src/infrastructure/config/environment-config/environment-config.module';
import { TypeOrmConfigModule } from './infrastructure/config/typeorm/typeorm.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
    }),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
    MailerModule,
    TypeOrmConfigModule,
    SharedModule,
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AppService,
    LoggerService,
    {
      provide: 'IException',
      useClass: ExceptionsService,
    },
  ],
  exports: [],
})
export class AppModule {}
