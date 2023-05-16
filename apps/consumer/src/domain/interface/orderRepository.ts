import { OrderM } from '../model/OrderM';

export abstract class OrderRepository {
  abstract placeOrder(itemName: string, amount: number): Promise<void>;
  abstract findProduct(itemName: string): Promise<OrderM>;
}
