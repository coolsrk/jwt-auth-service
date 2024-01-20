import { Config } from '../interfaces/config/config';
import dotenv from 'dotenv';
dotenv.config();

const devConfig: Config = {
  stack: 'dev',
  dbConfig: {
    dbName: process.env.DEV_DB || '',
    dbUser: process.env.DEV_USER || '',
    dbPassword: process.env.DEV_PASSWORD || '',
    dbHost: process.env.DEV_HOST || '',
  },
  port: Number(process.env.DEV_PORT) || 3000};

const prodConfig: Config = {
  stack: 'prod',
  dbConfig: {
    dbName: process.env.PROD_DB || '',
    dbUser: process.env.PROD_USER || '',
    dbPassword: process.env.PROD_PASSWORD || '',
    dbHost: process.env.PROD_HOST || '',
  },
  port: Number(process.env.PROD_PORT) || 3000};

const testConfig: Config = {
  stack: 'test',
  dbConfig: {
    dbName: 'test',
    dbUser: 'test',
    dbPassword: 'test',
    dbHost: 'test',
  },
  port: 3000
};

const getConfig = (env?: string):Config => {
  if(env === 'dev'){
    return devConfig;
  }
  if(env === 'prod'){
    return prodConfig;
  }
  if(env === 'test'){
    return testConfig;
  }

  throw new Error('Specify the correct environment!');
};

export const config = getConfig(process.env.NODE_ENV);  
