import { remaining } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { RemainingMonsterEvent } from "../events/RemainingMonsterEvent";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";
import { LogLevel } from "../models";

export class RemainingMonsterMatcher extends Matcher {
  protected static readonly remainingRegex: Record<Language, RegExp> = regexPerLanguage(
    remaining as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents = "remainingMonster";

  public match(
    line: string,
    logEvent: LogEvent,
    language: Language
  ): RemainingMonsterEvent | undefined {
    const regex = RemainingMonsterMatcher.remainingRegex[language];
    if (logEvent.logLevel != LogLevel.Info) return;

    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      monsterCount: parseInt(groups["count"]),
      more: groups["more"] != undefined,
    };
  }
}
