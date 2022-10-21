import { joinedArea, leftArea } from "../resources/Regex.json";

import { AreaEvent } from "../events/AreaEvent";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { AreaAction } from "../models/AreaAction";
import { Language } from "../models/Language";
import { Matcher } from "./Matcher";
import { regexPerLanguage } from "../utils/Functions";
import { LogLevel } from "../models";

export class AreaMatcher extends Matcher {
  public eventName: keyof PathOfExileLogEvents;

  protected static readonly joinedAreaRegex: Record<Language, RegExp> = regexPerLanguage(
    joinedArea as Record<string, string>
  );

  protected static readonly leftAreaRegex: Record<Language, RegExp> = regexPerLanguage(
    leftArea as Record<string, string>
  );

  constructor(eventName?: keyof PathOfExileLogEvents) {
    super();
    this.eventName = eventName || "areaJoinedBy";
  }

  public match(line: string, logEvent: LogEvent, language: Language): AreaEvent | undefined {
    const event =
      this.matchAreaJoined(line, logEvent, language) ||
      this.matchAreaLeft(line, logEvent, language);
    if (!event) return;

    if (event.action == AreaAction.Joined) this.eventName = "areaJoinedBy";
    else this.eventName = "areaLeftBy";

    return event;
  }

  private matchAreaJoined(
    line: string,
    logEvent: LogEvent,
    language: Language
  ): AreaEvent | undefined {
    if (logEvent.logLevel != LogLevel.Info) return;

    const regex = AreaMatcher.joinedAreaRegex[language];
    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      action: AreaAction.Joined,
      player: groups["player"],
    };
  }

  private matchAreaLeft(
    line: string,
    logEvent: LogEvent,
    language: Language
  ): AreaEvent | undefined {
    const regex = AreaMatcher.leftAreaRegex[language];
    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      action: AreaAction.Left,
      player: groups["player"],
    };
  }
}
