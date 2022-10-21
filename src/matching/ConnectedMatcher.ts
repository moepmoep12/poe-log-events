import { connected } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { ConnectedEvent } from "../events/ConnectedEvent";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";
import { LogLevel } from "../models";

export class ConnectedMatcher extends Matcher {
  protected static readonly connectedRegex: Record<Language, RegExp> = regexPerLanguage(
    connected as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents = "connected";

  public match(line: string, logEvent: LogEvent, language: Language): ConnectedEvent | undefined {
    if (logEvent.logLevel != LogLevel.Info) return;

    const regex = ConnectedMatcher.connectedRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      serverAddress: groups["address"],
    };
  }
}
