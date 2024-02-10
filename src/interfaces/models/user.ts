import { PasswordInterface } from './password';
import { RefreshTokenInterface } from './refreshToken';

export interface UserInterface {
  userId?: string;
  name: string;
  lastName?: string;
  mobNo?: number;
  email: string;
  address?: string;
  password?: PasswordInterface;
  refreshToken?: RefreshTokenInterface[];
  roleId? : number
}
