import { expressApp } from './app';
import { Logger } from './lib/logger/logger';
import { Server } from './server';


const log = new Logger();
const createServer = async () => {
  const server = new Server(log);
  await Promise.all([
    server.dbConnection()
  ]);
  expressApp();
};

createServer()
.then()
.catch((error: unknown) => console.error(error instanceof Error 
  ? error.message 
  : JSON.stringify(error)));
