import { WorldArea } from "../models/WorldArea";
import { LogEvent } from "./LogEvent";

export interface AreaGeneratedEvent extends LogEvent, WorldArea {
  seed: number;
}
