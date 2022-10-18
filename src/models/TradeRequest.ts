import { CurrencyItem } from "./CurrencyItem";

export interface TradeRequest {
  item: string | CurrencyItem;

  league: string;

  price?: number;
  currency?: CurrencyItem;
}

export interface TradeItemRequest extends TradeRequest {
  item: string;
  stashTab: string;
  left: number;
  top: number;
}

export interface TradeBulkRequest extends TradeRequest {
  amount: number;
  item: CurrencyItem;
}
