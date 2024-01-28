import { UserInterface } from '../../models';
import { UserRegistrationRequest } from '../../request';
import { UserResponse } from '../../response/userRegistrationResponse';

export interface UserServiceInterface {
  createUser(userInfo: UserRegistrationRequest): Promise<UserResponse|null>;
  generatePasswordHash(password: string): {salt: string, password: string};
  findUserByEmail(email: string): Promise<UserResponse|null>;
  getUserById(userId: string): Promise<UserResponse|null>
  mapUserInfo(inputData: UserInterface): UserResponse;
}