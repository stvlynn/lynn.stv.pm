export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Port: structured logging, implemented in infrastructure. */
export interface Logger {
  log(level: LogLevel, message: string, fields?: Record<string, unknown>): void;
}
