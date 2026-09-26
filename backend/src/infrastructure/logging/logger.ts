import type { Logger, LogLevel } from '../../application/shared';

const ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

/** Structured JSON logger writing one line per entry to stdout / stderr. */
export class JsonLogger implements Logger {
  constructor(private readonly minimum: LogLevel) {}

  log(level: LogLevel, message: string, fields: Record<string, unknown> = {}): void {
    if (ORDER[level] < ORDER[this.minimum]) {
      return;
    }
    const line = JSON.stringify({ time: new Date().toISOString(), level, message, ...fields });
    if (level === 'error' || level === 'warn') {
      process.stderr.write(`${line}\n`);
    } else {
      process.stdout.write(`${line}\n`);
    }
  }
}

/** Logger that records entries in memory, for tests. */
export class MemoryLogger implements Logger {
  readonly entries: { level: LogLevel; message: string; fields: Record<string, unknown> }[] = [];

  log(level: LogLevel, message: string, fields: Record<string, unknown> = {}): void {
    this.entries.push({ level, message, fields });
  }
}
