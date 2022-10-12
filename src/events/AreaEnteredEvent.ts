import { LogEvent } from "./LogEvent";

export interface AreaEnteredEvent extends LogEvent {
  newArea: string;
}
