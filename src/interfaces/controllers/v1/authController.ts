import { Logger } from '../../../lib/logger/logger';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../../service/v1/authService';
import { UserService } from '../../../service/v1';

export interface AuthControllerInterface {
  logger: Logger;
  authService: AuthService;
  userService: UserService;
  login(req: Request, res: Response, next: NextFunction): Promise<any>;
  getNewTokenByRefreshToken(req: Request, res: Response, next: NextFunction): Promise<any>;
}
