export type Config = {
  stack: string;
  dbConfig: {
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbHost: string;
  },
  port: number
}