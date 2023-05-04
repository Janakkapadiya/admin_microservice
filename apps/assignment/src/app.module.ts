import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { JwtStrategy } from '../../../libs/shared/src/infrastructure/common/strategies/jwt.strategy';
import { LocalStrategy } from '../../../libs/shared/src/infrastructure/common/strategies/local.strategy';
import { EnvironmentConfigModule } from '../../../libs/shared/src/infrastructure/config/environment-config/environment-config.module';
import { BcryptModule } from '../../../libs/shared/src/infrastructure/services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from '../../../libs/shared/src/infrastructure/services/jwt/jwt.module';
import { MailerModule } from '../../../libs/shared/src/infrastructure/services/mail/mail.module';
import { AppService } from './app.service';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { SharedModule } from '@app/shared/rmq/rmqmodule';

@Module({
  imports: [
    SharedModule.registerRmq(
      'CONSUMER_SERVICE',
      process.env.RABBITMQ_CONSUMER_QUEUE,
    ),
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
  ],
  providers: [LocalStrategy, JwtStrategy, AppService],
  exports: [RabbitMQModule],
})
export class AppModule {}
