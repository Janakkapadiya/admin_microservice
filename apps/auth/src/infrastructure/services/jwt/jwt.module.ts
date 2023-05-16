import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    Jwt.register({
      secret: process.env.JWT_SECRET,
      signOptions: { algorithm: 'HS512', expiresIn: '24h' },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtModule {}
