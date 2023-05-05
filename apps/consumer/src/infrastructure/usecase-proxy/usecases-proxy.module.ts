import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseOrderRepository } from '../repositories/orders.repository';
import { UseCaseProxy } from './usecases-proxy';
import { RequestOrderUseCase } from '../../usecases/orders/placeorder.usecases';
import { OrderRepositoriesModule } from '../repositories/orders.repository.module';

@Module({
  imports: [OrderRepositoriesModule],
})
export class UserUsecasesProxyModule {
  //place Order
  static PLACE_ORDER_USECASES_PROXY = 'placeOrderUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UserUsecasesProxyModule,
      providers: [
        {
          inject: [DatabaseOrderRepository],
          provide: UserUsecasesProxyModule.PLACE_ORDER_USECASES_PROXY,
          useFactory: (userRepository: DatabaseOrderRepository) =>
            new UseCaseProxy(new RequestOrderUseCase(userRepository)),
        },
      ],

      exports: [UserUsecasesProxyModule.PLACE_ORDER_USECASES_PROXY],
    };
  }
}
