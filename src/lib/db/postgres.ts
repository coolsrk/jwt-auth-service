import { Sequelize } from 'sequelize-typescript';
import { config } from '../../config/config';
import { Logger } from '../logger/logger';

export class Postgres {
  public readonly connector: Sequelize;
  public readonly logger: Logger;

  constructor(logger: Logger){
    this.logger = logger;
    this.connector = this.sequelizeInit();
  }

  private sequelizeInit(): Sequelize {
    const { dbUser, dbPassword, dbHost, dbName } = config.dbConfig;
    const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      dialect:
        'postgres',
      logging: false,
      models: [`${__dirname}/../../models/`],
    });

    return sequelize;
  }

  public close() {
    this.connector.close();
  }

  public async isAuthenticated(): Promise<boolean>{
    try {
      await this.connector.authenticate();  
      return true;
    } catch (error: unknown) {
        this.logger
        .error(`Error connecting to the database: ${error instanceof Error 
          ? error.message 
          : JSON.stringify(error)}`);
        return false;  
    }
  }
}
