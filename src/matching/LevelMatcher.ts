import { level } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { LevelEvent } from "../events/LevelEvent";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";

export class LevelMatcher extends Matcher {
  protected static readonly levelRegex: Record<Language, RegExp> = regexPerLanguage(
    level as Record<string, string>
  );
  public eventName: keyof PathOfExileLogEvents = "level";

  public match(line: string, logEvent: LogEvent, language: Language): LevelEvent | undefined {
    const regex = LevelMatcher.levelRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      class: groups["class"],
      character: groups["name"],
      characterLevel: parseInt(groups["level"]),
    };
  }
}
