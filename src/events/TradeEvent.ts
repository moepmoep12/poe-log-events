import { TradeAction } from "../models/TradeAction";

import { LogEvent } from "./LogEvent";

export interface TradeEvent extends LogEvent {
  tradeAction: TradeAction;
}
