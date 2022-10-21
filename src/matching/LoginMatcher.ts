import { login } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { LogEvent } from "../events/LogEvent";
import { LoginEvent } from "../events/LoginEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { Language } from "../models/Language";

import { Matcher } from "./Matcher";
import { LogLevel } from "../models";

export class LoginMatcher extends Matcher {
  protected static readonly loginRegex: Record<Language, RegExp> = regexPerLanguage(
    login as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents = "login";

  public match(line: string, logEvent: LogEvent, language: Language): LoginEvent | undefined {
    if (logEvent.logLevel != LogLevel.Info) return;

    const regex = LoginMatcher.loginRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    return {
      ...logEvent,
      address: groups["address"],
      time: parseFloat(groups["time"]),
    };
  }
}
