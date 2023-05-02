import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../../libs/shared/src/infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from '../../../libs/shared/src/infrastructure/common/strategies/jwt.strategy';
import { JwtModule as JwtServiceModule } from '../../../libs/shared/src/infrastructure/services/jwt/jwt.module';
import { BcryptModule } from '../../../libs/shared/src/infrastructure/services/bcrypt/bcrypt.module';
import { EnvironmentConfigModule } from '../../../libs/shared/src/infrastructure/config/environment-config/environment-config.module';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { AppService } from './app.service';
import { MailerModule } from '../../../libs/shared/src/infrastructure/services/mail/mail.module';
import { ExceptionsModule } from '@app/shared/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/infrastructure/logger/logger.module';

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
  ],
  providers: [LocalStrategy, JwtStrategy, AppService],
})
export class AppModule {}
