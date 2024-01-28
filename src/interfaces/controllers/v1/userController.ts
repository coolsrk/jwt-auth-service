import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../../lib/logger/logger';
import { UserService } from '../../../service/v1';

export interface UserControllerInterface {
  logger: Logger;
  userService: UserService;
  registerUser(req: Request, res: Response, next: NextFunction): Promise<any>;
  getUserInfo(req: Request, res: Response, next: NextFunction): Promise<any>;
}
