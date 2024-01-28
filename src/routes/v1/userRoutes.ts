import express, { Router } from 'express';
import { UserController } from '../../controllers/v1/userController';

export class UserRoutes {
  private readonly router: Router;
  constructor(){
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes = () =>{
    const userController = new UserController();
    this.router.post('/register', userController.registerUser);
    this.router.get('/:userId', userController.getUserInfo);
  };

  public getRoutes = () => {
    return this.router; 
  };
}