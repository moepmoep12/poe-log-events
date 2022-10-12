import { LogEvent } from "./LogEvent";

export interface CreatedQueryEvent extends LogEvent {
  seconds: number;
  minutes?: number;
  hours?: number;
  days?: number;
}
