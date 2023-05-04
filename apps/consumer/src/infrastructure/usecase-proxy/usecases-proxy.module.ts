import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseOrderRepository } from '../repositories/orders.repository';
import { UseCaseProxy } from './usecases-proxy';
import { RequestOrderUseCase } from '../../usecases/orders/placeorder.usecases';
import { OrderRepositoriesModule } from '../repositories/orders.repository.module';

@Module({
  imports: [OrderRepositoriesModule],
})
export class UsecasesProxyModule {
  //place Order
  static PLACE_ORDER_USECASES_PROXY = 'placeOrderUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [DatabaseOrderRepository],
          provide: UsecasesProxyModule.PLACE_ORDER_USECASES_PROXY,
          useFactory: (userRepository: DatabaseOrderRepository) =>
            new UseCaseProxy(new RequestOrderUseCase(userRepository)),
        },
      ],

      exports: [UsecasesProxyModule.PLACE_ORDER_USECASES_PROXY],
    };
  }
}
