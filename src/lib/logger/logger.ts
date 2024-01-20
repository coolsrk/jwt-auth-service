import winston, { format } from 'winston';
import { LogContext, LogLevel, LoggerInstance } from './types';
import dotenv from 'dotenv';
dotenv.config();

export class Logger implements LoggerInstance {
  private logger: winston.Logger;
  readonly nameSpace: string;

  constructor() {
    this.logger = this.initializeWinston();
    this.nameSpace = 'jwt-auth-service';
  }

  public info(msg: string, context?: LogContext) {
    this.log(msg, LogLevel.INFO, context);
  }
  public warn(msg: string, context?: LogContext) {
    this.log(msg, LogLevel.WARN, context);
  }
  public error(msg: string, context?: LogContext) {
    this.log(msg, LogLevel.ERROR, context);
  }
  public debug(msg: string, context?: LogContext) {
    if (process.env.ENV === 'dev') {
      this.log(msg, LogLevel.DEBUG, context);
    }
  }

  private log(msg: string, level: LogLevel, context?: LogContext) {
    this.logger.log(level, msg, { context: context });
  }

  private initializeWinston() {
    const logger = winston.createLogger({
      transports: this.getTransports(),
    });
    return logger;
  }

  private getTransports() {
    const transports = [
      new winston.transports.Console({
        format: this.getFormatForConsole(),
      }),
    ];

    return transports;
  }

  private getFormatForConsole() {
    return format.combine(
      format.timestamp(),
      format.printf(
        (info) =>
          `[${info.timestamp}] [${this.nameSpace}] 
          [${info.level.toUpperCase()}]: -> ${info.message
          } ${info.context ? `\n  Context -> 
          ${JSON.stringify(info.context, null, 2)}` : '' // Including the context
          }`
      ),
      format.colorize({ all: true })
    );
  }
}
