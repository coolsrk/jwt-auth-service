import { Logger } from '../../../../src/lib/logger/logger';
import User from '../../../../src/models/user';
import { AuthService, UserService } from '../../../../src/service/v1';
import { mockUserDataWithAuthInfo } from '../../../resources/controller/v1/authController';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

  describe('generateJwtToken()', () => {
    it('Should generate JWT token and refresh token', () => {
      const jwtToken = mockAuthService.generateJwtToken('test@test.com', 'test', 1);
      expect(jwtToken).toHaveProperty('token');
      expect(jwtToken).toHaveProperty('refreshToken');
      const decoded: any = jwt.decode(jwtToken.token);
      console.log(JSON.stringify(decoded));
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('role');
      expect(decoded).toHaveProperty('tokenId');
      expect(decoded).toHaveProperty('email');
    });

    it('Should throw an error if failed to generate token', () => {
      jwt.sign = jest.fn().mockImplementationOnce(() => {throw new Error();});
      expect(mockAuthService.generateJwtToken).toThrow(/Error while generating JWT token:/gim);
    });
  });
});
