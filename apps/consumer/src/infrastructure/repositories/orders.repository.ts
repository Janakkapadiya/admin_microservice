import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from '../../domain/interface/orderRepository';
import { OrderM } from '../../domain/model/OrderM';
import { Product } from '../entity/product.entity';

@Injectable()
export class DatabaseOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findProduct(itemName: string): Promise<OrderM> {
    const product = await this.productRepository.findOne({
      where: {
        itemName: itemName,
      },
    });
    if (!product) {
      return null;
    }
    return product;
  }

  async placeOrder(itemName: string, amount: number): Promise<void> {
    await this.productRepository.update(
      { itemName: itemName },
      { amount: amount },
    );
  }
}
