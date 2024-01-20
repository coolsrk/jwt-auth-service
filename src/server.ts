import { Postgres } from './lib/db/postgres';
import { Logger } from './lib/logger/logger';

export class Server {
  public readonly logger: Logger;
  public readonly postgres: Postgres;

  constructor(logger: Logger){
    this.logger = logger;
    this.postgres = new Postgres(this.logger);
  }

  public async dbConnection() {
    if(await this.postgres.isAuthenticated()){
      this.logger.info('Connected to the DB successfully!');
      this.postgres.connector.sync({alter: true});
    }else{
      throw new Error('Failed to connect to the DB.');
    }
  };
}

