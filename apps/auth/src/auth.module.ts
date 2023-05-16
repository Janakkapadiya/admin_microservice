import { Module } from '@nestjs/common';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from 'apps/auth/src/infrastructure/services/jwt/jwt.module';
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthUsecasesProxyModule } from './infrastructure/usecase-proxy/usecases-proxy.module';
import {
  ExceptionsModule,
  ExceptionsService,
  LoggerModule,
  LoggerService,
  SharedModule,
} from '@app/shared';
import { AuthController } from './infrastructure/controllers/auth/auth.controller';

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
