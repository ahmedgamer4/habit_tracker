import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const pepper = process.env.BCRYPT_PASSWORD_PEPPER;
const salt = process.env.BCRYPT_SALT_ROUNDS;

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(`${pepper}${password}`, parseInt(salt));
};

export const comparePasswords = async (hashed: string, password: string) => {
  return await bcrypt.compare(`${pepper}${password}`, hashed);
};
