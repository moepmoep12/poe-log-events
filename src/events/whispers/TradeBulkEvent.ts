import { CurrencyItem } from "../../models/CurrencyItem";
import { TradeBulkRequest } from "../../models/TradeRequest";
import { WhisperEvent } from "./WhisperEvent";

export interface TradeBulkEvent extends WhisperEvent, TradeBulkRequest {
  price: number;
  currency: CurrencyItem;

  additionalMessage?: string;
}
