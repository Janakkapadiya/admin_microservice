import { Module } from '@nestjs/common';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthUsecasesProxyModule } from './infrastructure/usecase-proxy/usecases-proxy.module';
import { AuthController } from './infrastructure/controllers/auth/auth.controller';
import { SharedModule } from '../../../libs/shared/src/rmq/rmqmodule';
import { LoggerModule } from './../../../libs/shared/src/infrastructure/logger/logger.module';
import { ExceptionsModule } from './../../../libs/shared/src/infrastructure/exceptions/exceptions.module';
import { LoggerService } from './../../../libs/shared/src/infrastructure/logger/logger.service';
import { ExceptionsService } from './../../../libs/shared/src/infrastructure/exceptions/exceptions.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.secret,
    }),
    BcryptModule,
    AuthUsecasesProxyModule.register(),
    JwtServiceModule,
    SharedModule,
    LoggerModule,
    ExceptionsModule,
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, LoggerService, ExceptionsService],
})
export class AuthModule {}
