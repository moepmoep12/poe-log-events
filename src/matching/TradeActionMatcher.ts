import { trade } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { TradeEvent } from "../events/TradeEvent";
import { TradeAction } from "../models/TradeAction";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";
import { LogLevel } from "../models";

export class TradeActionMatcher extends Matcher {
  protected static readonly tradeRegex: Record<Language, RegExp> = regexPerLanguage(
    trade as Record<string, string>
  );
  public eventName: keyof PathOfExileLogEvents;

  constructor(eventName?: keyof PathOfExileLogEvents) {
    super();
    this.eventName = eventName || "tradeAccepted";
  }

  public match(line: string, logEvent: LogEvent, language: Language): TradeEvent | undefined {
    if (logEvent.logLevel != LogLevel.Info) return;

    const regex = TradeActionMatcher.tradeRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    let action = TradeAction.Accepted;
    this.eventName = "tradeAccepted";

    if (groups["cancelled"]) {
      action = TradeAction.Cancelled;
      this.eventName = "tradeCancelled";
    }

    return {
      ...logEvent,
      tradeAction: action,
    };
  }
}
