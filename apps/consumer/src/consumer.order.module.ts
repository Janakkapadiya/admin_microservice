import { Module } from '@nestjs/common';
import { ConsumerController } from './infrastructure/controllers/consumer.order.controller';
import { ConsumerService } from './consumer.order.service';
import { SharedService } from '@app/shared/rmq/rmqservice';
import { SharedModule } from '@app/shared';
import { UserUsecasesProxyModule } from './infrastructure/usecase-proxy/usecases-proxy.module';
import { UserControllersModule } from './infrastructure/controllers/consumer.controller.module';
import { OrderRepositoriesModule } from './infrastructure/repositories/orders.repository.module';

@Module({
  imports: [
    SharedModule,
    UserUsecasesProxyModule.register(),
    UserControllersModule,
    OrderRepositoriesModule,
  ],
  controllers: [ConsumerController],
  providers: [
    ConsumerService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class ConsumerModule {}
