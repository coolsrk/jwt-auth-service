import { UserController } from '../../../src/controllers/v1';
import { UserRegistrationRequest } from '../../../src/interfaces/request';
import { Logger } from '../../../src/lib/logger/logger';
import { Request, Response } from 'express';
import { mockCreatedUser, mockUserInfo } from '../../../resources/controller/v1/userController';
import { UserRegistrationResponse } from 
'../../../src/interfaces/response/userRegistrationResponse';

describe('UserController', () => {
  let mockUserController: UserController;
  let mockLogger: Logger;
  let mockRequest: Request;
  let mockResponse: Response;
  let userInfo: UserRegistrationRequest;
  let userCreatedResponse: UserRegistrationResponse;

  beforeAll(() => {
    mockUserController = new UserController();
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;
    mockUserController.logger = mockLogger;
    userInfo = mockUserInfo;
    userCreatedResponse = mockCreatedUser;
    mockRequest = {
      body: userInfo,
    } as unknown as Request;
    mockResponse = {
      status: jest.fn().mockReturnValue({
        send: jest.fn()
      }),
    } as unknown as Response;
  });

  describe('registerUser()', () => {
    it('Should successfully able to create an user', async () => {
      mockRequest.body = userInfo;
      mockUserController.userService.createUser = jest.fn().mockResolvedValue(userCreatedResponse);
      mockUserController.userService.findUserByEmail = jest.fn().mockResolvedValueOnce(null);

      await mockUserController.
      registerUser(mockRequest, mockResponse, ()=>{});
      expect(mockResponse?.status).toHaveBeenCalledWith(201);
      expect(mockResponse?.status(201).send).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: userCreatedResponse,
        errors: [],
      });
    });

    it('Should return 400 bad request if email is not present in the input json', async () => {
      userInfo.email = ' ';
      mockRequest.body = userInfo;
      mockUserController.userService.createUser = jest.fn().mockResolvedValue(userCreatedResponse);
      mockUserController.userService.findUserByEmail = jest.fn().mockResolvedValueOnce(null);

      await mockUserController.
      registerUser(mockRequest, mockResponse, ()=>{});
      expect(mockResponse?.status).toHaveBeenCalledWith(400);
      expect(mockResponse?.status(400).send).toHaveBeenCalledWith({
        success: false,
        message: 'Email should not be empty!',
        data: {},
        errors: [],
      });
    });

    it('Should return status 409 if user already exists', async () => {
      userInfo.email = 'test@gmail.com';
      mockRequest.body = userInfo;
      mockUserController.userService.findUserByEmail = jest.fn().mockResolvedValueOnce(userInfo);

      await mockUserController.
      registerUser(mockRequest, mockResponse, ()=>{});
      expect(mockResponse?.status).toHaveBeenCalledWith(409);
      expect(mockResponse?.status(409).send).toHaveBeenCalledWith({
        success: false,
        message: 'User already exist!',
        data: {},
        errors: [],
      });
    });

    it('Should return 400 bad request if password length is less than 5', async () => {
      userInfo.password = 'test';
      mockRequest.body = userInfo;
      mockUserController.userService.findUserByEmail = jest.fn().mockResolvedValueOnce(null);

      await mockUserController.
      registerUser(mockRequest, mockResponse, ()=>{});
      expect(mockResponse?.status).toHaveBeenCalledWith(400);
      expect(mockResponse?.status(400).send).toHaveBeenCalledWith({
        success: false,
        message: 'Password length must be greater than 5 and less than 15 characters!',
        data: {},
        errors: [],
      });
    });

    it('Should return 400 bad request if password length is greater than 15', async () => {
      userInfo.password = 'test123456789012345';
      mockRequest.body = userInfo;
      mockUserController.userService.findUserByEmail = jest.fn().mockResolvedValueOnce(null);

      await mockUserController.
      registerUser(mockRequest, mockResponse, ()=>{});
      expect(mockResponse?.status).toHaveBeenCalledWith(400);
      expect(mockResponse?.status(400).send).toHaveBeenCalledWith({
        success: false,
        message: 'Password length must be greater than 5 and less than 15 characters!',
        data: {},
        errors: [],
      });
    });
  });
});