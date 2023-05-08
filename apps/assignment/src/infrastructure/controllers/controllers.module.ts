import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { PostController } from './post/post.controller';
import { UserController } from './user/User.controller';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    UsecasesProxyModule.register(),
    SharedModule.registerRmq(
      'CONSUMER_SERVICE',
      process.env.RABBITMQ_CONSUMER_QUEUE,
    ),
  ],
  controllers: [UserController, AuthController, PostController],
})
export class ControllersModule {}
