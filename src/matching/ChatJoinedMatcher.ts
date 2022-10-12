import { chatJoined } from "../resources/Regex.json";
import { regexPerLanguage } from "../utils/Functions";
import { ChatJoinedEvent } from "../events/ChatJoinedEvent";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { Language } from "../models/Language";
import { ChatType } from "../models/ChatType";

import { Matcher } from "./Matcher";

export class ChatJoinedMatcher extends Matcher {
  protected static readonly chatJoinedRegex: Record<Language, RegExp> = regexPerLanguage(
    chatJoined as Record<string, string>
  );

  public eventName: keyof PathOfExileLogEvents = "chatJoined";

  public match(line: string, logEvent: LogEvent, language: Language): ChatJoinedEvent | undefined {
    const regex = ChatJoinedMatcher.chatJoinedRegex[language];
    if (!regex) throw new Error(`Missing regex for language ${language}!`);

    const match = regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    let chatType = ChatType.Trade;
    if (groups["global"]) chatType = ChatType.Global;

    return {
      ...logEvent,
      channel: parseInt(groups["channel"]),
      chatType: chatType,
      // the russian version doesn't specify a language
      language: groups["lang"] || "English",
    };
  }
}
