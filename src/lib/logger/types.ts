export declare type LogContext = {
  [key: string]: any;
};

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LoggerInstance {
  /**
   * @param message - Message to log at level = 'debug'.
   * @param context {LogContext} - Optional additional metadata, added
   * to the `.context` object in the log document
   */

  debug(message: string, context?: LogContext): void;
  /**
   * @param context {LogContext} - Optional additional metadata, added
   * to the `.context` object in the log document
   */

  info(message: string, context?: LogContext): void;
  /**
   * @param message - Message to log at level = 'warn'.
   * @param context {LogContext} - Optional additional metadata, added
   * to the `.context` object in the log document
   */
  warn(message: string, context?: LogContext): void;

  /**
   * @param message - Message to log at level = 'error'.
   * @param context {LogContext} - Optional additional metadata, added
   * to the `.context` object in the log document
   */
  error(message: string, context?: LogContext): void;
}
