import { genSalt, hash, compare } from 'bcryptjs';
import { PasswordNotMatchError } from '../errors/auth-errors';

const SALT_ROUNDS = 10;

export const encrypt = async (plainTextPassword: string) => {
  const salt = await genSalt(SALT_ROUNDS);
  const hashedPassword = await hash(plainTextPassword, salt);
  return hashedPassword;
};

export const matchPassword = async (
  plainTextPassword: string,
  hashedPassword: string,
) => {
  return await compare(plainTextPassword, hashedPassword);
};

export async function verifyPassword(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<void> {
  const passwordMatch = await matchPassword(plainTextPassword, hashedPassword);

  if (!passwordMatch) {
    throw new PasswordNotMatchError();
  }
}
