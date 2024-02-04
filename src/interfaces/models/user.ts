import { PasswordInterface } from './password';

export interface UserInterface {
  userId?: string;
  name: string;
  lastName?: string;
  mobNo?: number;
  email: string;
  address?: string;
  password: PasswordInterface;
  roleId? : number
}
