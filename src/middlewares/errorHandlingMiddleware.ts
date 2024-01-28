import { NextFunction, Request, Response } from 'express';

export const errorHandlingMiddleware = (
  err: any,
  req: Request,
  res: Response, 
  _next: NextFunction) => {
  if (err instanceof Error) {
    return res
      .status(400)
      .send({
        success: false,
        message: 'Something went wrong!',
        errors: [err.message],
        data: {},
      });
  }else {
    return res
      .status(500)
      .send({
        success: false,
        message: 'Internal server error!',
        errors: [JSON.stringify(err)],
        data: {},
      });
  }
};
