import { LogEvent } from "./LogEvent";

export interface PlayedQueryEvent extends LogEvent {
  seconds: number;
  minutes?: number;
  hours?: number;
  days?: number;
}
