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
    console.log('Inside UserRoutes setRoutes()');
    this.router.post('/register', userController.registerUser);
  };

  public getRoutes = () => {
    return this.router; 
  };
}