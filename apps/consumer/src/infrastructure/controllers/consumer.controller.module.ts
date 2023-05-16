import { Module } from '@nestjs/common';
import { UserUsecasesProxyModule } from '../usecase-proxy/usecases-proxy.module';
import { ConsumerController } from './consumer.order.controller';
import { ExceptionsModule, SharedService } from '@app/shared';

@Module({
  imports: [UserUsecasesProxyModule.register(), ExceptionsModule],
  controllers: [ConsumerController],
  providers: [
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class UserControllersModule {}
