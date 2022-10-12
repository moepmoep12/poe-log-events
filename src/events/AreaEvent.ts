import { AreaAction } from "../models/AreaAction";
import { LogEvent } from "./LogEvent";

export interface AreaEvent extends LogEvent {
  player: string;
  action: AreaAction;
}
