import { APP_NAME, APP_VERSION } from '../app/constants';
import type { Logger, LogMetadata, LogLevel } from './logger.types';

const formatMessage = (level: LogLevel, message: string, metadata?: LogMetadata): string => {
  const serializedMetadata =
    metadata && Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : '';

  return `[${APP_NAME} v${APP_VERSION}] [${level.toUpperCase()}] ${message}${serializedMetadata}`;
};

class ConsoleLogger implements Logger {
  private readonly environment: 'development' | 'production' | 'test';

  constructor(environment: 'development' | 'production' | 'test') {
    this.environment = environment;
  }

  private emit(level: LogLevel, message: string, metadata?: LogMetadata): void {
    if (this.environment === 'production') {
      console[level](formatMessage(level, message, metadata));
      return;
    }

    console[level](formatMessage(level, message, metadata));
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.emit('debug', message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.emit('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.emit('warn', message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.emit('error', message, metadata);
  }
}

export const createLogger = (environment: 'development' | 'production' | 'test'): Logger => {
  return new ConsoleLogger(environment);
};
