import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';


export const authMiddleware = (
  req: Request,
  res: Response, 
  next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;
      if(bearerToken){
        const token = bearerToken.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        req.user = {
          email: decoded['email'],
          userId: decoded['userId'],
          type: decoded['type']
        };
        next();
      }else {
        return res.status(403).send({
          success: false,
          message: 'Auth token is missing!',
          data: {},
          errors: [],
        });
      }  
    } catch (error: any) {
      if(error?.message === 'jwt expired'){
        return res.status(401).send({
          success: false,
          message: 'Token expired!',
          data: {},
          errors: [],
        });
      }
      // If signature is missing or mismatched
      if(error?.message === 'invalid signature'){
        return res.status(403).send({
          success: false,
          message: 'Invalid JWT Signature!',
          data: {},
          errors: [],
        });
      }
      next(error);
    }
  };
