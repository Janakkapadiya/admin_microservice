import { AllExceptionFilter } from '@app/shared/infrastructure/common/filter/exception';
import { LoggingInterceptor } from '@app/shared/infrastructure/common/interceptors/logger.interceptor';
import { LoggerService } from '@app/shared/infrastructure/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const env = process.env.NODE_ENV;

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

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

  const queue = configService.get('RABBITMQ_ASSIGNMENT_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
