import express, { Router } from 'express';
import { V1Routes } from './v1';

export class APIRoutes {
  private readonly router: Router;
  constructor(){
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes = () => {
    this.router.use('/v1', new V1Routes().getRoutes());
  };

  public getRoutes = () => {
    return this.router; 
  };
}