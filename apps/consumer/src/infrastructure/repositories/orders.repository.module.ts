import { TypeOrmConfigModule } from '@app/shared/infrastructure/config/typeorm/typeorm.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entity/product';
import { DatabaseOrderRepository } from './orders.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Product])],
  providers: [DatabaseOrderRepository],
  exports: [DatabaseOrderRepository],
})
export class OrderRepositoriesModule {}
