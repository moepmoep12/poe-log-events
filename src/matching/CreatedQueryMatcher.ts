import { created } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { CreatedQueryEvent } from "../events/CreatedQueryEvent";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";
import { LogLevel } from "../models";

export class CreatedQueryMatcher extends Matcher {
  protected static readonly createdRegex: Record<Language, RegExp> = regexPerLanguage(
    created as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents = "createdQuery";

  public match(
    line: string,
    logEvent: LogEvent,
    language: Language
  ): CreatedQueryEvent | undefined {
    if (logEvent.logLevel != LogLevel.Info) return;

    const regex = CreatedQueryMatcher.createdRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      seconds: parseInt(groups["seconds"]),
      minutes: parseInt(groups["minutes"]),
      hours: parseInt(groups["hours"]),
      days: parseInt(groups["days"]),
    };
  }
}
