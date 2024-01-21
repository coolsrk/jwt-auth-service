import express, {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import { Logger } from './lib/logger/logger';
import { APIRoutes } from './routes';

dotenv.config();
const app = express();
app.use(express.json());
const LOG = new Logger();

export const expressApp = () => {
  app.use('/health', (_req: Request, _res: Response, next: NextFunction) => {
    _res.send('Welcome to JWT Auth Service! 🚀');
    next();
  });

  app.use('/api', new APIRoutes().getRoutes());

  app.listen(process.env.PORT, () => {
    LOG.info(`Working! Check it out on http://localhost:${process.env.PORT}`);
  });
};
