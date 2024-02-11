import { DateTime } from 'luxon';
import { Logger } from '../../../../src/lib/logger/logger';
import RefreshToken from '../../../../src/models/refreshToken';
import User from '../../../../src/models/user';
import { AuthService, UserService } from '../../../../src/service/v1';
import { mockRefreshTokenInfo, mockUserDataWithAuthInfo } from '../../../resources/controller/v1/authController';
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
    it('Should generate JWT token and refresh token', async () => {
      RefreshToken.create = jest.fn().mockResolvedValueOnce(mockRefreshTokenInfo);

      const jwtToken = await mockAuthService.generateJwtToken('test@test.com', 'test', 1);
      expect(jwtToken).toHaveProperty('token');
      expect(jwtToken).toHaveProperty('refreshToken');
      const decoded: any = jwt.decode(jwtToken.token);
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('role');
      expect(decoded).toHaveProperty('email');
    });

    it('Should throw an error if failed to generate token', async () => {
      jwt.sign = jest.fn().mockImplementationOnce(() => {throw new Error();});
      await expect(mockAuthService.generateJwtToken('test@test.com', 'test', 1)).rejects
      .toThrow(/Error while generating JWT token:/gim);
    });
  });

  describe('getRefreshTokenInfo()', () => {
    it('should return refresh token info', async () => {
      RefreshToken.findOne = jest.fn().mockResolvedValueOnce(mockRefreshTokenInfo);

      const result = await mockAuthService.getRefreshTokenInfo('test');
      expect(result).toEqual(mockRefreshTokenInfo);
    });

    it('should return null if refresh token with given id does not exist', async () => {
      RefreshToken.findOne = jest.fn().mockResolvedValueOnce(null);

      const result = await mockAuthService.getRefreshTokenInfo('test');
      expect(result).toEqual(null);
    });

    it('should throw an error if something goes wrong', async () => {
      RefreshToken.findOne = jest.fn().mockRejectedValueOnce('error');
      await expect(mockAuthService.getRefreshTokenInfo('test')).rejects.toThrow('error');
    });
  });

  describe('isRefeshTokenExpired()', () => {
    it('should return true if current date-time is greater than the expiry date-time', () => {
      const result 
      = mockAuthService.isRefeshTokenExpired(DateTime.now().minus({hours:1}).toUTC().toISO());
      expect(result).toEqual(true);
    });

    it('should return false if current date-time is lesser than the expiry date-time', () => {
      const result
       = mockAuthService.isRefeshTokenExpired(DateTime.now().plus({hours:1}).toUTC().toISO());
      expect(result).toEqual(false);
    });
  });
});
