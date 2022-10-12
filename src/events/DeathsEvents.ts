import { LogEvent } from "./LogEvent";

export interface DeathsEvent extends LogEvent {
  deathCount: number;
}
