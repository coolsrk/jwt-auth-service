import { UserControllerInterface } from '../../interfaces/controllers/v1';
import { NextFunction, Request, Response } from 'express';
import { UserServiceInterface } from '../../interfaces/service/v1';
import { UserService } from '../../service/v1';
import { Logger } from '../../lib/logger/logger';
import { UserRegistrationRequest } from '../../interfaces/request';

export class UserController implements UserControllerInterface {
  public logger: Logger;
  public userService: UserServiceInterface;
  constructor() {
    this.logger = new Logger();
    this.userService = new UserService(this.logger);
  }

  public registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {      
      const userInfo: UserRegistrationRequest = req.body;

      if(!userInfo.email.trim()){
        return res.status(400)
        .send({
          success: false,
          message: 'Email should not be empty!',
          data: {},
          errors: [],
        });
      }

      const isUserExist = await this.userService.findUserByEmail(userInfo.email);
      if(isUserExist){
        return res.status(409)
        .send({
          success: false,
          message: 'User already exist!',
          data: {},
          errors: [],
        });
      }

      if(userInfo.password.length < 5 || userInfo.password.length > 15){
        return res.status(400)
        .send({
          success: false,
          message: 'Password length must be greater than 5 and less than 15 characters!',
          data: {},
          errors: [],
        });
      }

      if(userInfo.password !== userInfo.confirmPassword){
        this.logger.error('Password and confirm password does not match!');
        return res.status(400)
        .send({
          success: false,
          message: 'User name and password does not match!',
          data: {},
          errors: [],
        });
      }

      const result = await this.userService.createUser(userInfo);
      return res.status(201)
        .send({
          success: true,
          message: 'User registered successfully',
          data: result,
          errors: [],
        });
    } catch (error: unknown) {
      next(error);
    }
  };
}
