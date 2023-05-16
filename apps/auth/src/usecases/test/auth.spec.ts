import { beforeAll, describe, expect, it, vitest } from 'vitest';
import { LoginUseCases } from '../auth/login.usecases';
import { IsAuthenticatedUseCases } from 'apps/auth/src/usecases/auth/isAuthenticated.usecases';
import { LogoutUseCases } from '../auth/logout.usecases';
import { RegisterUseCases } from 'apps/auth/src/usecases/auth/register.user.usecase';
import { IException, ILogger } from '@app/shared';
import { IJwtService } from 'apps/auth/src/domain/adepters/jwt.interface';
import { JWTConfig } from 'apps/auth/src/domain/config/jwt.conf.interface';
import { UserRepository } from '../../../../assignment/src/domain/interface/UserRepository';
import { IBcryptService } from 'apps/auth/src/domain/adepters/bcrypt.interface';
import { UserM } from 'apps/assignment/src/domain/model/UserM';

describe('usecases/authentication', () => {
  let loginUseCases: LoginUseCases;
  let isAuthenticated: IsAuthenticatedUseCases;
  let logoutUseCases: LogoutUseCases;
  let register: RegisterUseCases;
  let logger: ILogger;
  let exception: IException;
  let jwtService: IJwtService;
  let jwtConfig: JWTConfig;
  let userRepository: UserRepository;
  let bcryptService: IBcryptService;

  beforeAll(async () => {
    logger = {} as ILogger;
    logger.log = vitest.fn();

    exception = {} as IException;
    exception.UnauthorizedException = vitest.fn();
    exception.badRequestException = vitest.fn();
    exception.forbiddenException = vitest.fn();
    exception.internalServerErrorException = vitest.fn();

    jwtService = {} as IJwtService;
    jwtService.checkToken = vitest.fn();
    jwtService.createToken = vitest.fn();

    jwtConfig = {} as JWTConfig;
    jwtConfig.getJwtSecret = vitest.fn();

    userRepository = {} as UserRepository;
    userRepository.findByEmail = vitest.fn();
    userRepository.createUser = vitest.fn();
    userRepository.register = vitest.fn();

    bcryptService = {} as IBcryptService;
    bcryptService.compare = vitest.fn();
    bcryptService.hash = vitest.fn();

    loginUseCases = new LoginUseCases(
      logger,
      jwtService,
      jwtConfig,
      userRepository,
      bcryptService,
      exception,
    );
    logoutUseCases = new LogoutUseCases();
    isAuthenticated = new IsAuthenticatedUseCases(userRepository);
    register = new RegisterUseCases(userRepository, exception, bcryptService);
  });

  describe('get cookie with jwt token', () => {
    it('should return', async () => {
      const maxAge = '2 * 60 * 60 * 1000';
      const token = 'token';

      (jwtConfig.getJwtSecret as jest.Mock).mockReturnValue('secret');
      (jwtService.createToken as jest.Mock).mockReturnValue(token);

      expect(await loginUseCases.getCookieWithJwtToken('username')).toBe(
        `Authentication=${token}; HttpOnly; Path=/ ; maxAge: ${maxAge},`,
      );
    });
  });

  describe('validate local strategy', () => {
    it('should throw an error because user is not found or user is null', async () => {
      (userRepository.findByEmail as jest.Mock).mockReturnValue(
        exception.UnauthorizedException({
          message: 'user could not found so can not validate user',
          code_error: 401,
        }),
      );
      expect(
        await loginUseCases.validateUserForLocalStragtegy('email', 'password'),
      ).toBe(
        exception.UnauthorizedException({
          message: 'user could not found so can not validate user',
          code_error: 401,
        }),
      );
    });

    it('should throw an error because the password is invalidate ot null', async () => {
      const user: UserM = {
        id: 1,
        name: 'John',
        role: null,
        email: 'email@example.com',
        password: 'password',
      };

      (userRepository.findByEmail as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(false),
      );

      expect(
        await loginUseCases.validateUserForLocalStragtegy('email', 'password'),
      ).toBe(
        exception.forbiddenException({
          message: "password doesn't match",
          code_error: 403,
        }),
      );
    });

    it('should return user without password', async () => {
      const user: UserM = {
        id: 1,
        name: 'John',
        role: null,
        email: 'email',
        password: 'password',
      };
      (userRepository.findByEmail as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(true),
      );

      const { password, ...result } = user;

      expect(bcryptService.compare).toBeCalledWith('password', user.password);

      expect(
        await loginUseCases.validateUserForLocalStragtegy(
          'username',
          'password',
        ),
      ).toStrictEqual(result);
    });
  });

  describe('validate user For JWTStrategy', () => {
    it('throw an error because user not found', async () => {
      (userRepository.findByEmail as jest.Mock).mockReturnValue(
        exception.UnauthorizedException({
          message: "password doesn't match",
          code_error: 403,
        }),
      );

      expect(await loginUseCases.validateUserForJWTStrategy('email')).toBe(
        exception.forbiddenException({
          message: "password doesn't match",
          code_error: 403,
        }),
      );
    });

    it('return user', async () => {
      const user: UserM = {
        id: 1,
        name: 'John',
        role: null,
        email: 'email',
        password: 'password',
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(
        Promise.resolve(user),
      );

      expect(await loginUseCases.validateUserForJWTStrategy('email')).toBe(
        user,
      );
    });
  });

  describe('logout', () => {
    it('should logged out', async () => {
      expect(await logoutUseCases.execute()).toEqual([
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0',
      ]);
    });
  });

  describe('isAuthenticated', () => {
    it('will return the authenticated user', async () => {
      const user: UserM = {
        id: 1,
        name: 'John',
        role: null,
        email: 'email',
        password: 'password',
      };

      (userRepository.findByEmail as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );

      const { password, ...info } = user;

      expect(await isAuthenticated.execute('email')).toStrictEqual(info);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const user: UserM = {
        id: 1,
        name: 'John',
        role: null,
        email: 'email',
        password: 'password',
      };

      (userRepository.findByEmail as jest.Mock).mockReturnValue(null);

      (userRepository.register as jest.Mock).mockResolvedValueOnce({
        ...user,
        password: 'hashedPassword',
      });

      (bcryptService.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

      expect(await register.execute(user)).toStrictEqual({
        ...user,
        password: 'hashedPassword',
      });
    });
  });
});
