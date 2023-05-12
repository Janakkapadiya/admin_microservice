import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthUsecasesProxyModule } from '../usecase-proxy/usecases-proxy.module';

@Module({
  imports: [AuthUsecasesProxyModule.register()],
  controllers: [AuthController],
})
export class ControllersModule {}
