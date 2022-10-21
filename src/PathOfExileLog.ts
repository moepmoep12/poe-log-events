import { TypedEmitter } from "tiny-typed-emitter";
import { Tail } from "tail";
import fs from "fs";

import { PathOfExileLogEvents } from "./events/PathOfExileLogEvents";
import { rootMatcher } from "./matching";
import { Optional } from "./utils/TypeUtils";
import { LogEvent } from "./events";
import { LogLevel } from "./models";
import { Language } from "./models/Language";
import { Matcher } from "./matching/Matcher";

export interface LogOptions {
  /**
   * The path to the Client.txt
   *
   * @example 'C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt'
   */
  logFilePath: string;

  /**
   * The client language. Default : English (en)
   */
  language?: Language;

  /**
   * The number of events that will be cached. Default : 1000
   */
  maxCachedEvents?: number;

  /**
   * Whether to ignore debug events. Default: false
   *
   * @remarks If false, Debug events are now longer parsed and emitted.
   */
  ignoreDebug?: boolean;
}

export class PathOfExileLog extends TypedEmitter<PathOfExileLogEvents> {
  private readonly _tail: Tail;
  private readonly _options: Required<LogOptions>;
  private _eventHistory: Array<LogEvent>;

  constructor(options: LogOptions) {
    super();

    if (!fs.existsSync(options.logFilePath)) {
      this.emit("error", new Error(`The specified log file ${options.logFilePath} does not exist`));
      return;
    }

    this._options = this._optionsWithDefaults(options);

    this._eventHistory = new Array<LogEvent>();

    this._tail = new Tail(options.logFilePath, {
      follow: false,
      fromBeginning: false,
    });

    this._tail.on("line", this._onNewLine.bind(this));

    this._tail.on("error", (error) => {
      this.emit("error", new Error(`Tail has encountered an error:  ${JSON.stringify(error)}`));
    });
  }

  public get Options(): Readonly<Required<LogOptions>> {
    return this._options;
  }

  /**
   * The history of fired events.
   *
   * @remarks Before an event is fired, it is first put into the event history.
   * Therefore, when an event is fired it is already at the end of this list.
   */
  public get EventHistory(): Array<Readonly<LogEvent>> {
    return this._eventHistory.slice(0, -1);
  }

  public changeLanguage(lan: Language) {
    this._options.language = lan;
  }

  private _onNewLine(line: string): void {
    try {
      if (line.includes("***** LOG FILE OPENING *****")) return;

      // Remove carriage return
      // NOTE: PoE run on wine, the client.txt file has Windows carriage return
      //       This cause an error when trying to execute the regexp on the line
      line = JSON.stringify(line).replace(/(\\r\\n|\\n|\\r)/, "");
      line = JSON.parse(line) as string;

      const logEvent: Partial<LogEvent> = {
        logMessage: line,
      };

      this._visitMatcher(rootMatcher, logEvent as LogEvent);
    } catch (error) {
      this.emit("error", error);
    }
  }

  private _optionsWithDefaults(options: LogOptions): Required<LogOptions> {
    const optionalDefaults: Required<Optional<LogOptions>> = {
      maxCachedEvents: 1000,
      ignoreDebug: false,
      language: Language.English,
    };
    return Object.assign(optionalDefaults, options);
  }

  private _cacheEvent(event: LogEvent) {
    if (this._eventHistory.length == this.Options.maxCachedEvents) {
      this._eventHistory.splice(0);
    }

    this._eventHistory.push(event);
  }

  private _visitMatcher(matcher: Readonly<Matcher>, logEvent: LogEvent) {
    try {
      const event = matcher.match(logEvent.logMessage, logEvent, this.Options.language);
      if (!event) return;

      this._cacheEvent(event);
      if (!(event.logLevel == LogLevel.Debug && this.Options.ignoreDebug)) {
        this.emit(matcher.eventName, event);
      }

      for (const child of matcher.Children) {
        this._visitMatcher(child, event);
      }
    } catch (error) {
      this.emit("error", error);
    }
  }
}
