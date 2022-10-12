import { played } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { PlayedQueryEvent } from "../events/PlayedQueryEvent";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";

export class PlayedQueryMatcher extends Matcher {
  protected static readonly playedRegex: Record<Language, RegExp> = regexPerLanguage(
    played as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents = "playedQuery";

  public match(line: string, logEvent: LogEvent, language: Language): PlayedQueryEvent | undefined {
    const regex = PlayedQueryMatcher.playedRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      seconds: parseInt(groups["seconds"]),
      minutes: groups["minutes"] ? parseInt(groups["minutes"]) : undefined,
      hours: groups["hours"] ? parseInt(groups["hours"]) : undefined,
      days: groups["days"] ? parseInt(groups["days"]) : undefined,
    };
  }
}
