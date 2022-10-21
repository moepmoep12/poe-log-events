import { slain } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { SlainEvent } from "../events/SlainEvent";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";
import { LogLevel } from "../models";

export class SlainMatcher extends Matcher {
  protected static readonly slainRegex: Record<Language, RegExp> = regexPerLanguage(
    slain as Record<string, string>
  );
  public eventName: keyof PathOfExileLogEvents = "slain";

  public match(line: string, logEvent: LogEvent, language: Language): SlainEvent | undefined {
    if (logEvent.logLevel != LogLevel.Info) return;

    const regex = SlainMatcher.slainRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      player: groups["name"],
    };
  }
}
