import {
  ILogger,
  IJwtService,
  JWTConfig,
  IBcryptService,
  IException,
  IJwtServicePayload,
} from '@app/shared';
import { UserRepository } from '../../domain/interface/UserRepository';

export class LoginUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JWTConfig,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly exception: IException,
  ) {}

  async getCookieWithJwtToken(email: string) {
    this.logger.log(
      'LoginUseCases execute',
      `The user ${email} have been logged.`,
    );
    const payload: IJwtServicePayload = { email: email };
    const secret = this.jwtConfig.getJwtSecret();
    const token = this.jwtTokenService.createToken(payload, secret);
    const cookie = `Authentication=${token}; HttpOnly; Path=/ ; maxAge: 2 * 60 * 60 * 1000,`;
    return cookie;
  }

  async validateUserForLocalStragtegy(email: string, pass: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.exception.UnauthorizedException({
        message: 'user could not found so can not validate user',
        code_error: 401,
      });
    }
    const match = await this.bcryptService.compare(pass, user.password);
    if (user && match) {
      const { password, ...result } = user;
      return result;
    }
    this.exception.forbiddenException({
      message: "password doesn't match",
      code_error: 403,
    });
  }

  async validateUserForJWTStragtegy(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.exception.UnauthorizedException({
        message: 'user could not found so can not validate user',
        code_error: 401,
      });
    }
    return user;
  }
}
