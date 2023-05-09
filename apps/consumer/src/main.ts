import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './consumer.order.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared/rmq/rmqservice';
import {
  AllExceptionFilter,
  LoggerService,
  LoggingInterceptor,
} from '@app/shared';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);

  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // pipes
  app.useGlobalPipes(new ValidationPipe());

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_CONSUMER_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  app.startAllMicroservices();

  await app.listen(6000);
}
bootstrap();
