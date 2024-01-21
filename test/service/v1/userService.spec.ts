import { mockCreatedUser, mockUserInfo } from '../../../resources/controller/v1/userController';
import { UserRegistrationRequest } from '../../../src/interfaces/request';
import { UserRegistrationResponse } from '../../../src/interfaces/response/userRegistrationResponse';
import { Logger } from '../../../src/lib/logger/logger';
import User from '../../../src/models/user';
import { UserService } from '../../../src/service/v1';

describe('User Service', () => {
  let mockLogger: Logger;
  let mockUserService: UserService;
  let userInfo: UserRegistrationRequest;
  let userCreatedResponse: UserRegistrationResponse;
  beforeAll(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;
    mockUserService = new UserService(mockLogger);
    userInfo = mockUserInfo;
    userCreatedResponse = mockCreatedUser;
  });

  describe('createUser()', () => {
    it('Should create a user successfully', async () => {
      User.create = jest.fn().mockResolvedValueOnce(Promise.resolve());
      const result = await mockUserService.createUser(userInfo);
      expect(result).toEqual(userCreatedResponse);
      expect(mockLogger.info).toHaveBeenCalledWith('User registered successfully!');
    });
  });

  describe('findUserByEmail()', () => {
    it('Should return user data if it is already present in the db', async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(userCreatedResponse);
      const result = await mockUserService.findUserByEmail('test@gmail.com');
      expect(result).toEqual(userCreatedResponse);
    });

    it('Should return null if the user is not present in the db', async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(null);
      const result = await mockUserService.findUserByEmail('test@gmail.com');
      expect(result).toEqual(null);
    });
  });
});