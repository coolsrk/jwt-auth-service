import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Logger } from './lib/logger/logger';

dotenv.config();
const app = express();
const LOG = new Logger();

app.use('/', (req: Request, res: Response) => {
  res.send('Welcome to JWT Auth Service! 🚀');
});

app.listen(process.env.PORT, () => {
  LOG.info(`Working! Check it out on http://localhost:${process.env.PORT}`);
});