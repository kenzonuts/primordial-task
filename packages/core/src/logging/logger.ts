import type { AppEnvironment } from '@core/app/types';
import type { LogLevel, Logger, LoggerFactory, LogMetadata } from '@core/logging/logger.types';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const normalizeMetadata = (metadata?: LogMetadata): LogMetadata | undefined => {
  if (!metadata || Object.keys(metadata).length === 0) {
    return undefined;
  }

  return metadata;
};

class DevelopmentLogger implements Logger {
  constructor(private readonly minLevel: LogLevel) {}

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.minLevel];
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const payload = {
      level,
      message,
      metadata: normalizeMetadata(metadata),
      timestamp: new Date().toISOString(),
    };

    console[level]('[DEV]', payload);
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.log('error', message, metadata);
  }
}

class ProductionLogger implements Logger {
  constructor(private readonly minLevel: LogLevel) {}

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.minLevel];
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const payload = {
      level,
      message,
      metadata: normalizeMetadata(metadata),
      timestamp: new Date().toISOString(),
    };

    if (level === 'debug') {
      return;
    }

    console[level](JSON.stringify(payload));
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.log('error', message, metadata);
  }
}

class TestLogger implements Logger {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
}

class AppLoggerFactory implements LoggerFactory {
  create(environment: AppEnvironment, minLevel: LogLevel = 'info'): Logger {
    if (environment === 'production') {
      return new ProductionLogger(minLevel);
    }

    if (environment === 'test') {
      return new TestLogger();
    }

    return new DevelopmentLogger(minLevel);
  }
}

export const loggerFactory: LoggerFactory = new AppLoggerFactory();

export const createLogger = (environment: AppEnvironment, minLevel: LogLevel = 'info'): Logger => {
  return loggerFactory.create(environment, minLevel);
};
