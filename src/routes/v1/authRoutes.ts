import express, { Router } from 'express';
import { AuthController } from '../../controllers/v1/authController';

export class AuthRoutes {
  private readonly router: Router;
  constructor(){
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes = () =>{
    const userController = new AuthController();
    this.router.post('/login', userController.login);
  };

  public getRoutes = () => {
    return this.router; 
  };
}
