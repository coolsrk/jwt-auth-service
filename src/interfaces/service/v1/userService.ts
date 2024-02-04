import User from '../../../models/user';
import { UserInterface } from '../../models';
import { UpdateUserRequest, UserRegistrationRequest } from '../../request';
import { UserResponse } from '../../response';
export interface UserServiceInterface {
  createUser(userInfo: UserRegistrationRequest): Promise<UserResponse|null>;
  generatePasswordHash(password: string): string;
  findUserByEmail(email: string): Promise<User|null>;
  getUserById(userId: string): Promise<User|null>
  mapUserInfo(inputData: UserInterface): UserResponse;
  updateUserInfo(inputData: UpdateUserRequest, userId: string): Promise<void>;
}
