import { away } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { AwayEvent } from "../events/AwayEvent";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { AwayMode } from "../models/AwayMode";
import { AwayStatus } from "../models/AwayStatus";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";
import { LogLevel } from "../models";

export class AwayMatcher extends Matcher {
  protected static readonly awayRegex: Record<Language, RegExp> = regexPerLanguage(
    away as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents;

  constructor(eventName?: keyof PathOfExileLogEvents) {
    super();
    this.eventName = eventName || "afk";
  }

  public match(line: string, logEvent: LogEvent, language: Language): AwayEvent | undefined {
    if (logEvent.logLevel != LogLevel.Info) return;

    const regex = AwayMatcher.awayRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    let status = AwayStatus.Off;
    if (groups["statusOn"]) status = AwayStatus.On;

    let mode = AwayMode.AFK;

    if (groups["afk"]) {
      if (status == AwayStatus.On) {
        this.eventName = "afk";
      } else {
        this.eventName = "afkEnd";
      }
    } else if (groups["dnd"]) {
      mode = AwayMode.DND;
      if (status == AwayStatus.On) {
        this.eventName = "dnd";
      } else {
        this.eventName = "dndEnd";
      }
    }

    return {
      ...logEvent,
      newMode: mode,
      newStatus: status,
      autoreply: groups["reply"],
    };
  }
}
