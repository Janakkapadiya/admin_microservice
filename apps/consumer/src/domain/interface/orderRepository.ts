import { OrderM } from 'apps/assignment/src/domain/model/UserM';

export abstract class OrderRepository {
  abstract placeOrder(itemName: string, amount: number): Promise<void>;
}
