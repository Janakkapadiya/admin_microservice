import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { DatabaseOrderRepository } from './orders.repository';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Product])],
  providers: [DatabaseOrderRepository],
  exports: [DatabaseOrderRepository],
})
export class OrderRepositoriesModule {}
