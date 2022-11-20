import { regexPerLanguage } from "../../utils/Functions";

import { TradeItemEvent } from "../../events";
import { PathOfExileLogEvents } from "../../events/PathOfExileLogEvents";
import { WhisperEvent } from "../../events/whispers/WhisperEvent";
import { Language, WhisperDirection } from "../../models";
import { tradeItemPrice, tradeItemNoPrice } from "../../resources/Regex.json";

import { Matcher } from "../Matcher";
import { getTradeCurrencyItemByName, TradeBulkCurrencyItem } from "../../models/TradeCurrencyItem";

export class TradeItemWhisperMatcher extends Matcher {
  protected static readonly pricedItemRegex: Record<Language, RegExp> = regexPerLanguage(
    tradeItemPrice as Record<string, string>
  );

  protected static readonly unpricedItemRegex: Record<Language, RegExp> = regexPerLanguage(
    tradeItemNoPrice as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents;

  constructor(eventName?: keyof PathOfExileLogEvents) {
    super();
    this.eventName = eventName || "buyItemWhisperSent";
  }

  public match(
    line: string,
    logEvent: WhisperEvent,
    language: Language
  ): TradeItemEvent | undefined {
    const match =
      TradeItemWhisperMatcher.pricedItemRegex[language].exec(logEvent.whisper) ||
      TradeItemWhisperMatcher.unpricedItemRegex[language].exec(logEvent.whisper);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    if (logEvent.direction == WhisperDirection.From) this.eventName = "sellItemWhisperReceived";
    else this.eventName = "buyItemWhisperSent";

    const itemName = groups["currency"];

    const currency = getTradeCurrencyItemByName(itemName, language) as TradeBulkCurrencyItem;
    if (currency) currency.whisperLabel = itemName;

    return {
      ...logEvent,
      item: groups["name"],
      left: parseInt(groups["left"]),
      top: parseInt(groups["top"]),
      stashTab: groups["stash"],
      price: groups["price"] ? parseFloat(groups["price"]) : undefined,
      currency: currency,
      additionalMessage: groups["message"],
      league: groups["league"],
    };
  }
}
