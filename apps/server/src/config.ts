import { registerAs } from '@nestjs/config';

export const DBConfig = registerAs('db', () => ({
  file: '../store.db',
}));

export const JWTConfig = registerAs('jwt', () => ({
  secretKey: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
}));
