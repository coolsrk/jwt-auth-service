import { Request, Response } from 'express';
import {authMiddleware} from '../../../src/middlewares/authMiddleware';
import jwt from 'jsonwebtoken';


describe('authMiddleware()', () => {
  let mockRequest: Request;
  let mockResponse: Response;

  beforeAll(() => {
    mockRequest = {
      headers: {
        authorization: 'Bearer test-token'
      }
    } as unknown as Request;
    mockResponse = {
      status: jest.fn().mockReturnValue({
        send: jest.fn(),
      }),
    } as unknown as Response;
  });

  it('Should return 403 if auth token is missing from request headers', () => {
    mockRequest.headers.authorization = '';

    authMiddleware(mockRequest, mockResponse, () => {});
    expect(mockResponse?.status).toHaveBeenCalledWith(403);
      expect(mockResponse?.status(403).send).toHaveBeenCalledWith({
        success: false,
        message: 'Auth token is missing!',
        data: {},
        errors: [],
      });
  });

  it('Should return 401 if auth token is expired', () => {
    mockRequest.headers.authorization = 'Bearer test-token';

    jwt.verify = jest.fn().mockImplementationOnce(() => {throw new Error('jwt expired');});
    authMiddleware(mockRequest, mockResponse, () => {});
    expect(mockResponse?.status).toHaveBeenCalledWith(401);
      expect(mockResponse?.status(401).send).toHaveBeenCalledWith({
        success: false,
        message: 'Token expired!',
        data: {},
        errors: [],
      });
  });

  it('Should return 403 if signature is invalid', () => {
    mockRequest.headers.authorization = 'Bearer test-token';

    jwt.verify = jest.fn().mockImplementationOnce(() => {throw new Error('invalid signature');});
    authMiddleware(mockRequest, mockResponse, () => {});
    expect(mockResponse?.status).toHaveBeenCalledWith(403);
      expect(mockResponse?.status(403).send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid JWT Signature!',
        data: {},
        errors: [],
      });
  });
});


