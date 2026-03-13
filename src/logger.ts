/**
 * Represents a logger for Soundcloud class.
 * The interface was desinged to be implemented by pino.Logger, but you can choose what you prefer more
 */
export interface BaseLogger {
  silent(...data: any[]): void;
  trace(...data: any[]): void;
  debug(...data: any[]): void;
  info(...data: any[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
  fatal(...data: any[]): void;

  child(...data: any[]): BaseLogger;
}
