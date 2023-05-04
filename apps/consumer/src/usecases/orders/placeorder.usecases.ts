import { OrderRepository } from '../../domain/interface/orderRepository';

export class RequestOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(itemName: string, amount: number): Promise<void> {
    await this.orderRepository.placeOrder(itemName, amount);
  }
}
