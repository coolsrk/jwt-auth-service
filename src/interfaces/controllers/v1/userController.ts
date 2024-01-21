import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../../lib/logger/logger';

export interface UserControllerInterface {
  logger: Logger;
  registerUser(req: Request, res: Response, next: NextFunction): Promise<any>;
}
