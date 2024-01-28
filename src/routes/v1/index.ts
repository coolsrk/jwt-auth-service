import express, { Router } from 'express';
import { UserRoutes } from './userRoutes';
import { AuthRoutes } from './authRoutes';

export class V1Routes {
  private readonly router: Router;
  constructor(){
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes = () => {
    this.router.use('/user', new UserRoutes().getRoutes());
    this.router.use('/auth', new AuthRoutes().getRoutes());
  };

  public getRoutes = () => {
    return this.router; 
  };
}
