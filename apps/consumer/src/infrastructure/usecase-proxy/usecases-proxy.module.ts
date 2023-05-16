import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseOrderRepository } from '../repositories/orders.repository';
import { UseCaseProxy } from './usecases-proxy';
import { RequestOrderUseCase } from '../../usecases/orders/placeorder.usecases';
import { OrderRepositoriesModule } from '../repositories/orders.repository.module';
import { ExceptionsModule, ExceptionsService } from '@app/shared';

@Module({
  imports: [OrderRepositoriesModule, ExceptionsModule],
})
export class UserUsecasesProxyModule {
  //place Order
  static PLACE_ORDER_USECASES_PROXY = 'placeOrderUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UserUsecasesProxyModule,
      providers: [
        {
          inject: [DatabaseOrderRepository, ExceptionsService],
          provide: UserUsecasesProxyModule.PLACE_ORDER_USECASES_PROXY,
          useFactory: (
            userRepository: DatabaseOrderRepository,
            exception: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new RequestOrderUseCase(userRepository, exception),
            ),
        },
      ],

      exports: [UserUsecasesProxyModule.PLACE_ORDER_USECASES_PROXY],
    };
  }
}
