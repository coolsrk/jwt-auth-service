import {
  mockUserDbResponse,
  mockUserRegistrationRequest,
  mockUserResponse,
} from '../../resources/controller/v1/userController';
import { UserRegistrationRequest } from '../../../src/interfaces/request';
import { UserResponse } from '../../../src/interfaces/response';
import { Logger } from '../../../src/lib/logger/logger';
import User from '../../../src/models/user';
import { UserService } from '../../../src/service/v1';

describe('User Service', () => {
  let mockLogger: Logger;
  let mockUserService: UserService;
  let userInfo: UserRegistrationRequest;
  let userInfoResponse: UserResponse;
  beforeAll(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;
    mockUserService = new UserService(mockLogger);
    userInfo = mockUserRegistrationRequest;
    userInfoResponse = mockUserResponse;
  });

  describe('createUser()', () => {
    it('Should create a user successfully', async () => {
      User.create = jest.fn().mockResolvedValueOnce(Promise.resolve());
      const result = await mockUserService.createUser(userInfo);
      expect(result).toEqual(userInfoResponse);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'User registered successfully!'
      );
    });
  });

  describe('findUserByEmail()', () => {
    it('Should return user data if it is already present in the db', async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(mockUserDbResponse);
      const result = await mockUserService.findUserByEmail('test@gmail.com');
      expect(result).toEqual(userInfoResponse);
    });

    it('Should return null if the user is not present in the db', async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(null);
      const result = await mockUserService.findUserByEmail('test@gmail.com');
      expect(result).toEqual(null);
    });
  });

  describe('getUserById()', () => {
    it('Should return the user data if user with the given id is present', async () => {
      User.findByPk = jest.fn().mockResolvedValueOnce(mockUserDbResponse);
      const result = await mockUserService.getUserById(
        'a389eed4-1030-413d-af47-d11bee952498'
      );
      expect(result).toEqual(userInfoResponse);
    });

    it('Should return the null if user with the given id is not present', async () => {
      User.findByPk = jest.fn().mockResolvedValueOnce(null);
      const result = await mockUserService.getUserById(
        'a389eed4-1030-413d-af47-d11bee952498'
      );
      expect(result).toEqual(null);
    });

    it('Should throw an error if the uuid is not valid', async () => {
      User.findByPk = jest
        .fn()
        .mockRejectedValueOnce(
          'invalid input syntax for type uuid: "a389eed4-1030"'
        );
      await expect(
        mockUserService.getUserById('a389eed4-1030')
      ).rejects.toThrow(/invalid input syntax for type uuid: \\"a389eed4-1030\\"/gim);
    });
  });
});
