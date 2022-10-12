import { LogEvent } from "../../events/LogEvent";
import { PathOfExileLogEvents } from "../../events/PathOfExileLogEvents";
import { WhisperEvent } from "../../events/whispers/WhisperEvent";
import { WhisperDirection } from "../../models";
import { whisper } from "../../resources/Regex.json";

import { Matcher } from "../Matcher";

export class WhisperMatcher extends Matcher {
  protected _regex = new RegExp(whisper);

  public eventName: keyof PathOfExileLogEvents;

  constructor(children: Array<Readonly<Matcher>> = [], eventName?: keyof PathOfExileLogEvents) {
    super(children);
    this.eventName = eventName || "whisperReceived";
  }

  public match(line: string, logEvent: LogEvent): WhisperEvent | undefined {
    const match = this._regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    if (groups["from"]) this.eventName = "whisperReceived";
    else if (groups["to"]) this.eventName = "whisperSent";

    return {
      ...logEvent,
      whisper: groups["whisper"],
      player: groups["other"],
      direction: groups["from"] ? WhisperDirection.From : WhisperDirection.To,
    };
  }
}
