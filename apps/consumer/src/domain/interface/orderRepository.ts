export abstract class OrderRepository {
  abstract placeOrder(itemName: string, amount: number): Promise<void>;
}
