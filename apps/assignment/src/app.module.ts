import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { SharedModule } from '@app/shared/rmq/rmqmodule';
import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { MailerModule } from '../../../libs/shared/src/infrastructure/services/mail/mail.module';
import { AppService } from './app.service';
import { ControllersModule } from './infrastructure/controllers/controllers.module';

import { ExceptionsService, LoggerService } from '@app/shared';
import { EnvironmentConfigModule } from '../../../libs/shared/src/infrastructure/config/environment-config/environment-config.module';
import { TypeOrmConfigModule } from './infrastructure/config/typeorm/typeorm.module';
import { AuthModule } from 'apps/auth/src/auth.module';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    EnvironmentConfigModule,
    MailerModule,
    TypeOrmConfigModule,
    SharedModule,
    AuthModule,
  ],
  providers: [
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
