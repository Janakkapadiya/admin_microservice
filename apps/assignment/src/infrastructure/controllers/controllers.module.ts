import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { PostController } from './post/post.controller';
import { UserController } from './user/User.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [UserController, AuthController, PostController],
})
export class ControllersModule {}
