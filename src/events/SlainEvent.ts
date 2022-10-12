import { LogEvent } from "./LogEvent";

export interface SlainEvent extends LogEvent {
  player: string;
}
