import { LogMessage } from "../models/LogMessage";

/**
 * The base event for a new line
 */
export interface LogEvent extends LogMessage {
  /**
   * The time this event was fired
   */
  firedAt: Date;
}
