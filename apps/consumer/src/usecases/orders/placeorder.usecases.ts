import { IException } from '@app/shared';
import { OrderRepository } from '../../domain/interface/orderRepository';
import { OrderM } from '../../domain/model/OrderM';

export class RequestOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly exceptionsService: IException,
  ) {}

  async execute(itemName: string, amount: number): Promise<OrderM> {
    const product = await this.orderRepository.findProduct(itemName);
    if (!product) {
      this.exceptionsService.badRequestException({
        message: 'the product could not found',
        code_error: 400,
      });
    }

    const totalAmount = product ? product.amount : 0;

    if (amount > totalAmount || amount == 0) {
      this.exceptionsService.badRequestException({
        message: 'the product could not found or the quantity not sufficient',
        code_error: 400,
      });
    } else {
      product.amount -= amount;
      await this.orderRepository.placeOrder(itemName, product.amount);
    }

    return product;
  }
}
