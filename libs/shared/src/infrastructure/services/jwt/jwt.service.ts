import {
  IJwtService,
  IJwtServicePayload,
} from '@app/shared/domain/adepters/jwt.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async checkToken(token: string): Promise<any> {
    const decode = await this.jwtService.verifyAsync(token);
    return decode;
  }

  createToken(payload: IJwtServicePayload, secret: string): string {
    return this.jwtService.sign(payload, {
      secret: secret,
    });
  }
}
