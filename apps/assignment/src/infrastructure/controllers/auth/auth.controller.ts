import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import RegisterDto, { AuthLoginDto } from './auth-dto.class';
import { IsAuthPresenter } from './auth.presenter';

import { ApiResponseType } from '@app/shared/infrastructure/common/swagger/res.decorator';
import { UseCaseProxy } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { RegisterUseCases } from 'apps/assignment/src/usecases/auth/register.user.usecase';
import { JwtAuthGuard } from '@app/shared';
import { IsAuthenticatedUseCases } from 'apps/assignment/src/usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from 'apps/assignment/src/usecases/auth/login.usecases';
import { LogoutUseCases } from 'apps/assignment/src/usecases/auth/logout.usecases';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUsecaseProxy: UseCaseProxy<LogoutUseCases>,
    @Inject(UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
    private readonly isAuthUsecaseProxy: UseCaseProxy<IsAuthenticatedUseCases>,
    @Inject(UsecasesProxyModule.REGISTER_USER_USECASES_PROXY)
    private readonly registerUserTestCasesProxy: UseCaseProxy<RegisterUseCases>,
  ) {}

  @Post('register')
  @ApiResponseType(IsAuthPresenter, true)
  async register(@Body() registerData: RegisterDto) {
    const user = await this.registerUserTestCasesProxy
      .getInstance()
      .execute(registerData);
    return user;
  }

  @Post('login')
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Request() request: any) {
    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(auth.email);
    console.log(accessTokenCookie);
    request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    return 'Login successful';
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request: any) {
    const cookie = await this.logoutUsecaseProxy.getInstance().execute();
    request.res.setHeader('Set-Cookie', cookie);
    return 'Logout successful';
  }

  @Get('is_authenticated')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'is_authenticated' })
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthUsecaseProxy
      .getInstance()
      .execute(request.user.username);
    const response = new IsAuthPresenter();
    response.email = user.email;
    return response.email;
  }
}
