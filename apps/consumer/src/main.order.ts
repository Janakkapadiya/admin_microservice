import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './consumer.order.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);
  await app.listen(4000);
}
bootstrap();
