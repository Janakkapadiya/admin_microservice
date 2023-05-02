import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { PostController } from './post/post.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [PostController, AuthController],
})
export class ControllersModule {}
