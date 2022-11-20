import { TradeBulkCurrencyItem } from "../../models/TradeCurrencyItem";
import { TradeBulkRequest } from "../../models/TradeRequest";
import { WhisperEvent } from "./WhisperEvent";

export interface TradeBulkEvent extends WhisperEvent, TradeBulkRequest {
  price: number;
  currency: TradeBulkCurrencyItem;

  additionalMessage?: string;
}
