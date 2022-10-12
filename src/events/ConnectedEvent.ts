import { LogEvent } from "./LogEvent";

export interface ConnectedEvent extends LogEvent {
  serverAddress: string;
}
