import { regexPerLanguage } from "../utils/Functions";
import { areaEntered } from "../resources/Regex.json";
import { AreaEnteredEvent } from "../events/AreaEnteredEvent";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";
import { LogLevel } from "../models";

export class AreaEnteredMatcher extends Matcher {
  protected static readonly areaEnteredRegex: Record<Language, RegExp> = regexPerLanguage(
    areaEntered as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents = "areaEntered";

  public match(line: string, logEvent: LogEvent, language: Language): AreaEnteredEvent | undefined {
    if (logEvent.logLevel != LogLevel.Info) return;

    const regex = AreaEnteredMatcher.areaEnteredRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      newArea: groups["area"],
    };
  }
}
