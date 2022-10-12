import { TradeItemRequest } from "../../models/TradeRequest";
import { WhisperEvent } from "./WhisperEvent";

export interface TradeItemEvent extends WhisperEvent, TradeItemRequest {
  additionalMessage?: string;
}
