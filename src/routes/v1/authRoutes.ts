import express, { Router } from 'express';
import { AuthController } from '../../controllers/v1/authController';

export class AuthRoutes {
  private readonly router: Router;
  constructor(){
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes = () =>{
    const authController = new AuthController();
    this.router.post('/login', authController.login);
    this.router.get('/refreshToken/:refreshToken', authController.getNewTokenByRefreshToken);
  };

  public getRoutes = () => {
    return this.router; 
  };
}
