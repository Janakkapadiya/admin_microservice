import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionFilter } from '@app/shared/infrastructure/common/filter/exception';
import { LoggingInterceptor } from '@app/shared/infrastructure/common/interceptors/logger.interceptor';
import { LoggerService } from '@app/shared/infrastructure/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const env = process.env.NODE_ENV;

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // const USER = configService.get('RABBITMQ_USER');
  // const PASSWORD = configService.get('RABBITMQ_PASS');
  // const HOST = configService.get('RABBITMQ_HOST');
  // const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  // NestFactory.createMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
  //     noAck: false,
  //     queue: QUEUE,
  //     queueOptions: {
  //       durable: true,
  //     },
  //   },
  // });

  app.startAllMicroservices();

  app.use(cookieParser());

  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // pipes
  app.useGlobalPipes(new ValidationPipe());

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));

  // base routing
  app.setGlobalPrefix('api_v1');

  // swagger config
  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Admin Clean Architecture')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
