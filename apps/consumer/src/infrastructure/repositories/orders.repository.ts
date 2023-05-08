import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../domain/interface/orderRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/product';

@Injectable()
export class DatabaseOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async placeOrder(itemName: string, amount: number): Promise<void> {
    console.log(this.productRepository.exist ? true : false);
    const product = await this.productRepository.findOne({
      where: {
        itemName: itemName,
      },
    });
    console.log(product);
    const totalAmount = product ? product.amount : 0;

    if (amount > totalAmount) {
      throw new BadRequestException(
        `Requested amount (${amount}) is greater than total amount available (${totalAmount}) for ${itemName}`,
      );
    }

    if (product) {
      product.amount -= amount;
      console.log('your order has been placed');
      await this.productRepository.save(product);
    }
  }
}
