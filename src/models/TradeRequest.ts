export interface TradeRequest {
  item: string;

  league: string;

  price?: number;
  currency?: string;
}

export interface TradeItemRequest extends TradeRequest {
  stashTab: string;
  left: number;
  top: number;
}

export interface TradeBulkRequest extends TradeRequest {
  amount: number;
}
