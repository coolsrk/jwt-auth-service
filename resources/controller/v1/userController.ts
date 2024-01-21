import { UserRegistrationRequest } from '../../../src/interfaces/request';
import { UserRegistrationResponse } from '../../../src/interfaces/response/userRegistrationResponse';

export const mockUserInfo: UserRegistrationRequest = {
  firstName: 'test',
  lastName: 'test',
  password: 'test12345',
  confirmPassword: 'test12345',
  mobileNo: 1234567890,
  email: 'test1234@gmail.com',
  address: 'test',
};

export const mockCreatedUser: UserRegistrationResponse = {
  firstName: 'test',
  lastName: 'test',
  mobileNo: 1234567890,
  email: 'test1234@gmail.com',
  address: 'test',
};
