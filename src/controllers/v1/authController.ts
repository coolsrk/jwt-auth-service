import { NextFunction, Request, Response } from 'express';
import { AuthControllerInterface } from '../../interfaces/controllers/v1';
import { Logger } from '../../lib/logger/logger';
import { AuthService, UserService } from '../../service/v1';

export class AuthController implements AuthControllerInterface {
  public logger: Logger;
  public authService: AuthService;
  public userService: UserService;

  constructor (){
    this.logger = new Logger();
    this.userService = new UserService(this.logger);
    this.authService = new AuthService(this.logger, this.userService);
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const {email, password} = req.body;
      
      if(!email?.trim() || !password?.trim()){
        return res.status(400)
        .send({
          success: false,
          message: 'Email or password should not be empty!',
          data: {},
          errors: [],
        });
      }

      const user = await this.userService.findUserByEmail(email);
      if(!user){
        return res.status(404)
        .send({
          success: false,
          message: `User with email: ${email} does not exist!`,
          data: {},
          errors: [],
        });
      }

      const isAuthenticated = await this.authService.isUserAuthenticated(email, password);
      
      if(!isAuthenticated){
        return res.status(403)
        .send({
          success: false,
          message: 'Authentication failed due to wrong password!',
          data: {},
          errors: [],
        });
      }

      const {token, refreshToken} = this.authService.generateJwtToken(email, user.userId);
      return res.status(200)
      .send({
        success: true,
        message: 'Successfully logged in!',
        data:  {token, refreshToken},
        errors: [],
      });
    }catch(error){
      next(error);
    }
  };
}
