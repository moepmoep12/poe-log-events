import { regexPerLanguage } from "../../utils/Functions";

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

    return {
      ...logEvent,
      item: groups["name"],
      price: parseFloat(groups["price"]),
      currency: groups["currency"],
      additionalMessage: groups["message"],
      league: groups["league"],
      amount: parseInt(groups["count"]),
    };
  }
}
