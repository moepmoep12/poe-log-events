import { LogEvent } from "./LogEvent";

export interface LevelEvent extends LogEvent {
  characterLevel: number;
  character: string;
  class: string;
}
