import { LogEvent } from "./LogEvent";

export interface RemainingMonsterEvent extends LogEvent {
  monsterCount: number;

  more: boolean;
}
