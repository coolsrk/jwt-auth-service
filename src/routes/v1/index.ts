import express, { Router } from 'express';
import { UserRoutes } from './userRoutes';

export class V1Routes {
  private readonly router: Router;
  constructor(){
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes = () => {
    this.router.use('/user', new UserRoutes().getRoutes());
  };

  public getRoutes = () => {
    return this.router; 
  };
}