import { AuthController } from '../../../src/controllers/v1/authController';
import { Logger } from '../../../src/lib/logger/logger';
import { Request, Response } from 'express';
import { mockUserResponse } from '../../resources/controller/v1/userController';

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
        .mockResolvedValueOnce(mockUserResponse);
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
});
