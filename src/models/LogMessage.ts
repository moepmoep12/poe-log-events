import { LogLevel } from "./LogLevel";

export interface LogMessage {
  // The date of the log message
  date: Date;

  // Only the message without the additional info
  logMessage: string;

  // The log level
  logLevel: LogLevel;

  // The source of the log message, usually `CLIENT`
  source: string;

  // the whole line
  rawLine: string;
}
