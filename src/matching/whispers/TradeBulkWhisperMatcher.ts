import { regexPerLanguage } from "../../utils/Functions";

import { TradeBulkCurrencyItem, getTradeCurrencyItemByName } from "../../models/TradeCurrencyItem";
import { TradeBulkEvent } from "../../events";
import { PathOfExileLogEvents } from "../../events/PathOfExileLogEvents";
import { WhisperEvent } from "../../events/whispers/WhisperEvent";
import { Language, WhisperDirection } from "../../models";
import { tradeBulk } from "../../resources/Regex.json";

import { Matcher } from "../Matcher";

export class TradeBulkWhisperMatcher extends Matcher {
  protected static readonly bulkItemRegex: Record<Language, RegExp> = regexPerLanguage(
    tradeBulk as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents;

  constructor(eventName?: keyof PathOfExileLogEvents) {
    super();
    this.eventName = eventName || "buyBulkWhisperSent";
  }

  public match(
    line: string,
    logEvent: WhisperEvent,
    language: Language
  ): TradeBulkEvent | undefined {
    const match = TradeBulkWhisperMatcher.bulkItemRegex[language].exec(logEvent.whisper);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    if (logEvent.direction == WhisperDirection.From) this.eventName = "sellBulkWhisperReceived";
    else this.eventName = "buyBulkWhisperSent";

    let currencyItem = getTradeCurrencyItemByName(
      groups["currency"],
      language
    ) as TradeBulkCurrencyItem;
    if (!currencyItem) currencyItem = {} as TradeBulkCurrencyItem;
    currencyItem.whisperLabel = groups["currency"];

    let item = getTradeCurrencyItemByName(groups["name"], language) as TradeBulkCurrencyItem;
    if (!item) item = {} as TradeBulkCurrencyItem;
    item.whisperLabel = groups["name"];

    return {
      ...logEvent,
      item: item,
      price: parseFloat(groups["price"]),
      currency: currencyItem,
      additionalMessage: groups["message"],
      league: groups["league"],
      amount: parseInt(groups["count"]),
    };
  }
}
