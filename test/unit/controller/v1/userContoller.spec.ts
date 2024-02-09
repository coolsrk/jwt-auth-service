import { UserController } from '../../../../src/controllers/v1';
import { UserRegistrationRequest } from '../../../../src/interfaces/request';
import { Logger } from '../../../../src/lib/logger/logger';
import { Request, Response } from 'express';
import { mockUserDbResponse, mockUserRegistrationRequest,
   mockUserResponse } from '../../../resources/controller/v1/userController';
import { UserResponse } from '../../../../src/interfaces/response';

describe('UserController', () => {
  let mockUserController: UserController;
  let mockLogger: Logger;
  let mockRequest: Request;
  let mockResponse: Response;
  let userInfo: UserRegistrationRequest;
  let userCreatedResponse: UserResponse;

  beforeAll(() => {
    mockUserController = new UserController();
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;
    mockUserController.logger = mockLogger;
    userInfo = mockUserRegistrationRequest;
    userCreatedResponse = mockUserResponse;
    mockRequest = {
      user: {
        email: 'test@test.com',
        userId: 'a389eed4-1030-413d-af47-d11bee952498',
        tokenId: 'b389eed4-1030-413d-af47-d11bee952496',
      },
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
      mockUserController.userService.findUserByEmail 
      = jest.fn().mockResolvedValueOnce(mockUserDbResponse);

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

  describe('getUserInfoById()', ()=> {
    it('should return 400 if the current user tries to access the data of other user', async () => {
      mockRequest.params = {
        userId: 'test123'
      };

      await mockUserController.getUserInfoById(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(400);
      expect(mockResponse?.status(400).send).toHaveBeenCalledWith({
        success: false,
        message: 'User id not matching to current user.',
        data: {},
        errors: [],
      });
    });

    it('should return 404 if user is not found', async () => {
      mockRequest.params = {
        userId: 'a389eed4-1030-413d-af47-d11bee952498'
      };

      mockUserController.userService.getUserById
       = jest.fn().mockResolvedValueOnce(null);
      await mockUserController.getUserInfoById(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(404);
      expect(mockResponse?.status(404).send).toHaveBeenCalledWith({
        success: false,
        message: 'User with userId a389eed4-1030-413d-af47-d11bee952498 is not registered with us!',
        data: {},
        errors: [],
      });
    });

    it('should return 200 with user info if the user exist', async () => {
      mockRequest.params = {
        userId: 'a389eed4-1030-413d-af47-d11bee952498'
      };

      mockUserController.userService.getUserById
       = jest.fn().mockResolvedValueOnce(mockUserDbResponse);
      await mockUserController.getUserInfoById(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(200);
      expect(mockResponse?.status(200).send).toHaveBeenCalledWith({
        success: true,
        message: '',
        data: mockUserResponse,
        errors: [],
      });
    });
  });

  describe('updateUserInfo()', () => {
    it('should return 404 if user not found', async () => {
      mockUserController.userService.getUserById
       = jest.fn().mockResolvedValueOnce(null);
      await mockUserController.updateUserInfo(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(404);
      expect(mockResponse?.status(404).send).toHaveBeenCalledWith({
        success: false,
        message: 'User with email test@test.com is not registered with us!',
        data: {},
        errors: [],
      });
    });

    it('should successfully updates the user info', async () => {
      mockUserController.userService.getUserById 
        = jest.fn().mockResolvedValueOnce(mockUserDbResponse);
      mockUserController.userService.updateUserInfo
       = jest.fn().mockResolvedValueOnce(Promise.resolve());
      await mockUserController.updateUserInfo(mockRequest, mockResponse, () => {});
      expect(mockResponse?.status).toHaveBeenCalledWith(200);
      expect(mockResponse?.status(200).send).toHaveBeenCalledWith({
        success: true,
        message: 'Successfully upadted the user info!',
        data: {},
        errors: [],
      });
    });
  });
});
