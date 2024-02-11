import { AuthController } from '../../../../src/controllers/v1/authController';
import { Logger } from '../../../../src/lib/logger/logger';
import { Request, Response } from 'express';
import { mockUserDbResponse, mockUserResponse } from '../../../resources/controller/v1/userController';
import { mockRefreshTokenInfo } from '../../../resources/controller/v1/authController';

describe('AuthController', () => {
  let mockAuthController: AuthController;
  let mockLogger: Logger;
  let mockRequest: Request;
  let mockResponse: Response;

  beforeAll(() => {
    mockAuthController = new AuthController();
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;
    mockAuthController.logger = mockLogger;
    mockRequest = {
      body: { email: 'test@test.com', password: 'test' },
      params: {refreshToken: ''}
    } as unknown as Request;
    mockResponse = {
      status: jest.fn().mockReturnValue({
        send: jest.fn(),
      }),
    } as unknown as Response;
  });

  describe('login()', () => {
    it('Should return 400 bad request if email is empty', async () => {
      mockRequest.body.email = '';
      await mockAuthController.login(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(400);
      expect(mockResponse?.status(400).send).toHaveBeenCalledWith({
        success: false,
        message: 'Email or password should not be empty!',
        data: {},
        errors: [],
      });
    });

    it('Should return 400 bad request if password is empty', async () => {
      mockRequest.body.email = 'test@test.com';
      mockRequest.body.password = '';

      await mockAuthController.login(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(400);
      expect(mockResponse?.status(400).send).toHaveBeenCalledWith({
        success: false,
        message: 'Email or password should not be empty!',
        data: {},
        errors: [],
      });
    });

    it('Should return 404 if the user with given email does not exist', async () => {
      mockRequest.body.password = 'test';
      mockAuthController.userService.findUserByEmail = jest
        .fn()
        .mockResolvedValueOnce(null);

      await mockAuthController.login(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(404);
      expect(mockResponse?.status(404).send).toHaveBeenCalledWith({
        success: false,
        message: `User with email: test@test.com does not exist!`,
        data: {},
        errors: [],
      });
    });

    it(`Should return 403 unauthorized if 
    authentication failed due to wrong password`, async () => {
      mockAuthController.userService.findUserByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUserDbResponse);
      mockAuthController.authService.isUserAuthenticated = jest
        .fn()
        .mockResolvedValueOnce(false);

      await mockAuthController.login(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(403);
      expect(mockResponse?.status(403).send).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication failed due to wrong password!',
        data: {},
        errors: [],
      });
    });

    it('Should be able to successfully login', async () => {
      mockAuthController.userService.findUserByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUserResponse);
      mockAuthController.authService.isUserAuthenticated = jest
        .fn()
        .mockResolvedValueOnce(true);
      mockAuthController.authService.generateJwtToken = jest
        .fn()
        .mockReturnValueOnce({
          token: 'test',
          refreshToken: '32-chars-long-uuid',
        });

      await mockAuthController.login(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(200);
      expect(mockResponse?.status(200).send).toHaveBeenCalledWith({
        success: true,
        message: 'Successfully logged in!',
        data: {
          token: 'test',
          refreshToken: '32-chars-long-uuid',
        },
        errors: [],
      });
    });
  });

  describe('getNewTokenByRefreshToken()', () => {
    it('Should return status 400 if refresh token is not provided in the params', async () => {
      await mockAuthController.getNewTokenByRefreshToken(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(400);
      expect(mockResponse?.status(400).send).toHaveBeenCalledWith({
        success: false,
        message: 'Refresh token not provided!',
        data: {},
        errors: [],
      });
    });

    it('Shout return status 404 if the refresh token is not found', async () => {
      mockRequest.params = {refreshToken: 'test'};

      mockAuthController.authService.getRefreshTokenInfo = jest.fn().mockResolvedValueOnce(null);
      await mockAuthController.getNewTokenByRefreshToken(mockRequest, mockResponse, () => {});
      expect(mockResponse.status(404).send).toHaveBeenCalledWith({
        success: false,
        message: 'Refresh token test not found!',
        data: {},
        errors: [],
      });
    });

    it(`Should send the response with the message 
    containing "JWT Token is still alive for refresh token"
    if the refresh token is not expired yet.`, async () => {
      mockRequest.params = {refreshToken: 'test'};

      mockAuthController.authService.getRefreshTokenInfo
       = jest.fn().mockResolvedValueOnce(mockRefreshTokenInfo);

      mockAuthController.authService.isRefeshTokenExpired
      = jest.fn().mockReturnValueOnce(false);

      await mockAuthController.getNewTokenByRefreshToken(mockRequest, mockResponse, () => {});
      expect(mockResponse.status(200).send).toHaveBeenCalledWith({
        success: true,
        message: `JWT Token is still alive for refresh token test`,
        data: {},
        errors: [],
      });
    });

    it(`Should generate new token and refresh token if the refresh token is expired.`, async () => {
      mockRequest.params = {refreshToken: 'test'};

      // mockRefreshTokenInfo.expiryTime = new Date('2024-01-21T15:25:12.517Z');
      mockAuthController.authService.getRefreshTokenInfo
       = jest.fn().mockResolvedValueOnce(mockRefreshTokenInfo);

      mockAuthController.authService.isRefeshTokenExpired
      = jest.fn().mockReturnValueOnce(true);

      mockAuthController.userService.getUserById
       = jest.fn().mockResolvedValueOnce(mockUserDbResponse);

      mockAuthController.authService.generateJwtToken = jest
        .fn()
        .mockResolvedValueOnce({
          token: 'test',
          refreshToken: '32-chars-long-uuid',
        });


      await mockAuthController.getNewTokenByRefreshToken(mockRequest, mockResponse, () => {});  
      expect(mockResponse.status(200).send).toHaveBeenCalledWith({
        success: true,
        message: ``,
        data: {
          token: 'test',
          refreshToken: '32-chars-long-uuid',
        },
        errors: [],
      });
    });
  });
});
