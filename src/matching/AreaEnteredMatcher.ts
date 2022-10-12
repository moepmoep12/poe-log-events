import { regexPerLanguage } from "../utils/Functions";
import { areaEntered } from "../resources/Regex.json";
import { AreaEnteredEvent } from "../events/AreaEnteredEvent";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";

export class AreaEnteredMatcher extends Matcher {
  protected static readonly areaEnteredRegex: Record<Language, RegExp> = regexPerLanguage(
    areaEntered as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents = "areaChanged";

  public match(line: string, logEvent: LogEvent, language: Language): AreaEnteredEvent | undefined {
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
