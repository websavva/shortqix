import jwt from 'jsonwebtoken';

import type { AuthTokenPayload } from '../types';

const { JsonWebTokenError, TokenExpiredError } = jwt;

export class AuthJwtService {
  static sign(payload: AuthTokenPayload) {
    return jwt.sign(payload, process.env.AUTH_SECRET!, {
      expiresIn: `${+process.env.AUTH_TOKEN_EXPIRES_IN_MS!}ms`,
    });
  }

  static verify(token: string) {
    return jwt.verify(
      token,
      process.env.AUTH_SECRET!,
    ) as AuthTokenPayload;
  }

  static isAuthTokenError(error: any) {
    return (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError
    );
  }
}
