import User from '../../../models/user';
import { UserRegistrationRequest } from '../../request';
import { UserRegistrationResponse } from '../../response/userRegistrationResponse';

export interface UserServiceInterface {
  createUser(userInfo: UserRegistrationRequest): Promise<UserRegistrationResponse|null>;
  generatePasswordHash(password: string): {salt: string, password: string};
  findUserByEmail(email: string): Promise<User|null>;
}