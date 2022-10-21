import { deaths } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { DeathsEvent } from "../events/DeathsEvents";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";
import { LogLevel } from "../models";

export class DeathsMatcher extends Matcher {
  protected static readonly deathsRegex: Record<Language, RegExp> = regexPerLanguage(
    deaths as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents = "deathCount";

  public match(line: string, logEvent: LogEvent, language: Language): DeathsEvent | undefined {
    if (logEvent.logLevel != LogLevel.Info) return;

    const regex = DeathsMatcher.deathsRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      deathCount: parseInt(groups["count"]),
    };
  }
}
