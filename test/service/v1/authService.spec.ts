import { Logger } from '../../../src/lib/logger/logger';
import User from '../../../src/models/user';
import { AuthService, UserService } from '../../../src/service/v1';
import { mockUserDataWithAuthInfo } from '../../resources/controller/v1/authController';
import bcrypt from 'bcrypt';

describe('Auth Service', () => {
  let mockLogger: Logger;
  let mockAuthService: AuthService;
  let mockUserService: UserService;

  beforeAll(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;
    mockUserService = new UserService(mockLogger);
    mockAuthService = new AuthService(mockLogger, mockUserService);
  });

  describe('isUserAuthenticated()', () => {
    it('Should return true if user is authenticated successfully', async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(mockUserDataWithAuthInfo);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      const result = await mockAuthService.isUserAuthenticated(
        'test@test.com',
        'test'
      );
      expect(result).toEqual(true);
    });

    it('Should return false if user authentication fails', async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(mockUserDataWithAuthInfo);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);
      const result = await mockAuthService.isUserAuthenticated(
        'test@test.com',
        'test'
      );
      expect(result).toEqual(false);
    });

    it('Should throw an error if something goes wrong', async () => {
      User.findOne = jest.fn().mockRejectedValueOnce(new Error());
      await expect(
        mockAuthService.isUserAuthenticated('test@test.com', 'test')
      ).rejects.toThrow(/Error while authenticating user:/gim);
    });
  });
});
