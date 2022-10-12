import { ChatType } from "../models/ChatType";
import { LogEvent } from "./LogEvent";

export interface ChatJoinedEvent extends LogEvent {
  chatType: ChatType;
  channel: number;
  language: string;
}
