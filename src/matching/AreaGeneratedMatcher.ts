import { areaGenerated } from "../resources/Regex.json";
import { LogEvent } from "../events/LogEvent";
import { PathOfExileLogEvents } from "../events/PathOfExileLogEvents";
import { AreaGeneratedEvent } from "../events";

import { Matcher } from "./Matcher";
import { getWorldAreaById, WorldArea } from "../models/WorldArea";
import { Language } from "../models";

export class AreaGeneratedMatcher extends Matcher {
  protected static readonly regex = new RegExp(areaGenerated);

  public eventName: keyof PathOfExileLogEvents = "areaGenerated";

  public match(
    line: string,
    logEvent: LogEvent,
    language: Language
  ): AreaGeneratedEvent | undefined {
    const match = AreaGeneratedMatcher.regex.exec(line);
    if (!match) return;

    const groups = match.groups;
    if (!groups) return;

    const worldArea =
      getWorldAreaById(groups["area"], language) ||
      ({
        Id: groups["area"],
      } as WorldArea);

    return {
      ...logEvent,
      ...worldArea,
      // override because it may differ from the static description,
      // due to mechanics such as Voidstones or Atlas Passives
      AreaLevel: parseInt(groups["level"]),
      seed: parseInt(groups["seed"]),
    };
  }
}
