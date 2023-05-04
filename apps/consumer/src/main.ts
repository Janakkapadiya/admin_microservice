import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './consumer.order.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared/rmq/rmqservice';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_CONSUMER_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  app.startAllMicroservices();
}
bootstrap();
