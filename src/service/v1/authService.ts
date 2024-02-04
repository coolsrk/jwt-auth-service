import { AuthServiceInterface } from '../../interfaces/service/v1';
import { Logger } from '../../lib/logger/logger';
import Password from '../../models/password';
import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 } from 'uuid';
import { LoginResponse } from '../../interfaces/response';
import { UserService } from './userService';
dotenv.config();

export class AuthService implements AuthServiceInterface {
  public logger: Logger;
  public userService: UserService;

  constructor(logger: Logger, userService: UserService) {
    this.logger = logger;
    this.userService = userService;
  }

  public isUserAuthenticated = async (
    email: string,
    password: string
  ): Promise<any> => {
    try {
      const userAuthInfo = await User.findOne({
        where: { email: email },
        include: [{ model: Password, as: 'password' }],
      });

      return await bcrypt.compare(password, userAuthInfo!.password!.password);
    } catch (error) {
      throw new Error(`Error while authenticating user: 
      ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  };

  public generateJwtToken = (email: string, userId: string): LoginResponse => {
    try{
      const refreshToken = v4();
      const tokenId = v4();
      const token = jwt.sign(
        {
          tokenId,
          userId,
          email,
        },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: 60 * 60 }
      );
      return { token, refreshToken };
    }catch(error){
      throw new Error(`Error while generating JWT token: 
      ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  };
}
