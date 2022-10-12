import { AwayMode } from "../models/AwayMode";
import { AwayStatus } from "../models/AwayStatus";
import { LogEvent } from "./LogEvent";

export interface AwayEvent extends LogEvent {
  newMode: AwayMode;
  newStatus: AwayStatus;
  autoreply?: string;
}
