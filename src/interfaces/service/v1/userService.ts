import { UserInterface } from '../../models';
import { UserRegistrationRequest } from '../../request';
import { UserResponse } from '../../response';

export interface UserServiceInterface {
  createUser(userInfo: UserRegistrationRequest): Promise<UserResponse|null>;
  generatePasswordHash(password: string): string;
  findUserByEmail(email: string): Promise<UserResponse|null>;
  getUserById(userId: string): Promise<UserResponse|null>
  mapUserInfo(inputData: UserInterface): UserResponse;
}
