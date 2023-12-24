import { registerAs } from '@nestjs/config';

export const DBConfig = registerAs('db', () => ({
  file: '../store.db',
}));
