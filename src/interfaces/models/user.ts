import { PasswordInterface } from './password';
import { SaltInterface } from './salt';

export interface UserInterface {
  userId?: string;
  name: string;
  lastName?: string;
  mobNo?: number;
  email: string;
  address?: string;
  password: PasswordInterface;
  salt: SaltInterface;
}