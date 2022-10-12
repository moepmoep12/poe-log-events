import { LogEvent } from "./LogEvent";

export interface LoginEvent extends LogEvent {
  address: string;
  time: number;
}
