import { TradeBulkCurrencyItem } from "./TradeCurrencyItem";

/**
 * A general request (whisper) to trade an item/currency
 */
export interface TradeRequest {
  /**
   * The item to be bought/sold
   */
  item: string | TradeBulkCurrencyItem;

  /**
   * The league, e.g. Standard
   */
  league: string;

  /**
   * The price of the item, if specified
   */
  price?: number;

  /**
   * The currency in which the item is priced
   */
  currency?: TradeBulkCurrencyItem;
}

/**
 * A request (whisper) to trade an item
 */
export interface TradeItemRequest extends TradeRequest {
  item: string;
  stashTab: string;
  left: number;
  top: number;
}

/**
 * A request (whisper) to trade currency in bulk
 */
export interface TradeBulkRequest extends TradeRequest {
  amount: number;
  item: TradeBulkCurrencyItem;
}
