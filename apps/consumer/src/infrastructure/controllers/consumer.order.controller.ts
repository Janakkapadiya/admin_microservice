import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared/rmq/rmqservice';
import { OrderDto } from '../../domain/dto/orderdto';
import { UserUsecasesProxyModule } from '../usecase-proxy/usecases-proxy.module';
import { UseCaseProxy } from '../usecase-proxy/usecases-proxy';
import { RequestOrderUseCase } from '../../usecases/orders/placeorder.usecases';

@Controller()
export class ConsumerController {
  constructor(
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
    @Inject(UserUsecasesProxyModule.PLACE_ORDER_USECASES_PROXY)
    private readonly placeOrderUseCaseProxy: UseCaseProxy<RequestOrderUseCase>,
  ) {}

  @MessagePattern({ cmd: 'placeOrder' })
  async placeOrder(@Ctx() context: RmqContext, @Payload() order: OrderDto) {
    console.log(order);
    const { itemName, amount } = order;
    this.sharedService.acknowledgeMessage(context);
    return this.placeOrderUseCaseProxy.getInstance().execute(itemName, amount);
  }
}
