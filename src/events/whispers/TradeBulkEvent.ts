import { TradeBulkRequest } from "../../models/TradeRequest";
import { WhisperEvent } from "./WhisperEvent";

export interface TradeBulkEvent extends WhisperEvent, TradeBulkRequest {
  price: number;
  currency: string;

  additionalMessage?: string;
}
