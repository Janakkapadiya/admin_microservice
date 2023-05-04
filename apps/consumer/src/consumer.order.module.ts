import { Module } from '@nestjs/common';
import { ConsumerController } from './infrastructure/controllers/consumer.order.controller';
import { ConsumerService } from './consumer.order.service';
import { SharedService } from '@app/shared/rmq/rmqservice';

@Module({
  imports: [],
  controllers: [ConsumerController],
  providers: [
    ConsumerService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class ConsumerModule {}
