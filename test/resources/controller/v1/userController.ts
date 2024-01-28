import { UserRegistrationRequest } from '../../../../src/interfaces/request';
import { UserResponse } from '../../../../src/interfaces/response/userRegistrationResponse';

export const mockUserInfo: UserRegistrationRequest = {
  firstName: 'test',
  lastName: 'test',
  password: 'test12345',
  confirmPassword: 'test12345',
  mobileNo: 1234567890,
  email: 'test1234@gmail.com',
  address: 'test',
};

export const mockUserDbResponse = {
  userId: 'a389eed4-1030-413d-af47-d11bee952498',
  name: 'test',
  lastName: 'test',
  email: 'test1234@gmail.com',
  mobNo: 1234567890,
  address: 'test',
  createdAt: new Date('2024-01-21T15:25:12.431Z'),
  updatedAt: new Date('2024-01-21T15:25:12.431Z'),
};

export const mockCreatedUser: UserResponse = {
  firstName: 'test',
  lastName: 'test',
  mobileNo: 1234567890,
  email: 'test1234@gmail.com',
  address: 'test',
};
