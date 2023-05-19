import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UseCaseProxy } from '../apps/auth/src/infrastructure/usecase-proxy/usecases-proxy';
import { AuthModule } from '../apps/auth/src/auth.module';
import { JwtAuthGuard } from '../apps/auth/src/infrastructure/common/guards/jwtAuth.guard';
import { AuthUsecasesProxyModule } from '../apps/auth/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { IsAuthenticatedUseCases } from '../apps/auth/src/usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from '../apps/auth/src/usecases/auth/login.usecases';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

// jest

describe('apps/auth/src/infrastructure/controllers/auth', () => {
  let app: INestApplication;
  let loginUseCases: LoginUseCases;
  let isAuthenticatedUseCases: IsAuthenticatedUseCases;

  beforeAll(async () => {
    loginUseCases = {} as LoginUseCases;
    loginUseCases.getCookieWithJwtToken = jest.fn();
    loginUseCases.validateUserForJWTStrategy = jest.fn();
    loginUseCases.validateUserForLocalStragtegy = jest.fn();
    const loginUsecaseProxyService: UseCaseProxy<LoginUseCases> = {
      getInstance: () => loginUseCases,
    } as UseCaseProxy<LoginUseCases>;

    isAuthenticatedUseCases = {} as IsAuthenticatedUseCases;
    isAuthenticatedUseCases.execute = jest.fn();
    const isAuthUseCaseProxyService: UseCaseProxy<IsAuthenticatedUseCases> = {
      getInstance: () => isAuthenticatedUseCases,
    } as UseCaseProxy<IsAuthenticatedUseCases>;

    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthUsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
      .useValue(isAuthUseCaseProxyService)
      .overrideProvider(AuthUsecasesProxyModule.LOGIN_USECASES_PROXY)
      .useValue(loginUsecaseProxyService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate(context: ExecutionContext) {
          const req = context.switchToHttp().getRequest();
          req.user = { email: 'email' };
          return (
            JSON.stringify(req.cookies) ===
            JSON.stringify({
              Authentication: '123456',
              Path: '/',
              maxAge: '2 * 60 * 60 * 1000',
            })
          );
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  //login

  it(`/POST login should return 201`, async () => {
    (loginUseCases.validateUserForJWTStrategy as jest.Mock).mockReturnValue(
      Promise.resolve({
        id: 1,
        name: 'John',
        role: null,
        email: 'email',
      }),
    );
    (loginUseCases.getCookieWithJwtToken as jest.Mock).mockReturnValue(
      Promise.resolve(
        `Authentication=123456; HttpOnly; Path=/; maxAge: 2 * 60 * 60 * 1000`,
      ),
    );

    const result = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'email', password: 'password' })
      .expect(201);

    expect(result.headers['set-cookie']).toEqual([
      `Authentication=123456; HttpOnly; Path=/; maxAge: 2 * 60 * 60 * 1000`,
    ]);
  });

  // get logged in user issue as there is no refresh token logic

  it(`/GET is_authenticated should return 403`, async () => {
    (isAuthenticatedUseCases.execute as jest.Mock).mockReturnValue(
      Promise.resolve({ email: 'email' }),
    );

    await request(app.getHttpServer())
      .get('/auth/is_authenticated')
      .send()
      .expect(403);
  });
  afterAll(async () => {
    await app.close();
  });
});
