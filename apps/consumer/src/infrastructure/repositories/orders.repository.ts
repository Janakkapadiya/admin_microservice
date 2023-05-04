import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../domain/interface/orderRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/product';

@Injectable()
export class DatabaseOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(Product)
    private readonly userEntityRepository: Repository<Product>,
  ) {}

  async placeOrder(itemName: string, amount: number): Promise<void> {
    const product = await this.userEntityRepository.findOne({
      where: {
        itemName,
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
      await this.userEntityRepository.save(product);
    }
  }
}
