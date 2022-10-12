import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { LogLevel } from "../models/LogLevel";
import { base } from "../resources/Regex.json";

import { Matcher } from "./Matcher";

export class BaseMatcher extends Matcher {
  protected _regex = new RegExp(base);

  public eventName: keyof PathOfExileLogEvents = "line";

  public match(line: string, logEvent?: LogEvent): LogEvent | undefined {
    const match = this._regex.exec(logEvent?.rawLine || line);
    if (!match) throw new Error(`Failed to initially parse line ${line}!`);

    const groups = match.groups;
    if (!groups) return;

    // handle local time
    const date = new Date(groups["datetime"]);
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

    return {
      firedAt: new Date(Date.now()),
      logLevel: groups["level"] as LogLevel,
      rawLine: line,
      logMessage: groups["msg"],
      source: groups["src"],
      date: date,
    };
  }
}
