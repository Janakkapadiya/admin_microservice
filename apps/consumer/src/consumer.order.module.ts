import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.order.controller';
import { ConsumerService } from './consumer.order.service';

@Module({
  imports: [],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}
