import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { Language } from "../models/Language";

export abstract class Matcher {
  public abstract eventName: keyof PathOfExileLogEvents;

  protected _children: Array<Readonly<Matcher>>;

  constructor(children: Array<Readonly<Matcher>> = []) {
    this._children = children;
  }

  /**
   * Tries to match the given line
   *
   * @param line The log line
   * @param logEvent The basic LogEvent
   * @param language The current client language
   */
  public abstract match(line: string, logEvent: LogEvent, language: Language): LogEvent | undefined;

  public get Children(): Array<Readonly<Matcher>> {
    return this._children;
  }
}
