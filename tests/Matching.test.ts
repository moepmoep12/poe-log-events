import { describe, it } from "mocha";
import { assert, expect } from "chai";

import * as TestLines from "./resources/Messages.json";

import { Language } from "../src/models/Language";
import { LogEvent } from "../src/events/LogEvent";

import { BaseMatcher } from "../src/matching/BaseMatcher";
import { AreaMatcher } from "../src/matching/AreaMatcher";
import { AreaEnteredMatcher } from "../src/matching/AreaEnteredMatcher";
import { AwayMatcher } from "../src/matching/AwayMatcher";
import { ChatJoinedMatcher } from "../src/matching/ChatJoinedMatcher";
import { ConnectedMatcher } from "../src/matching/ConnectedMatcher";
import { CreatedQueryMatcher } from "../src/matching/CreatedQueryMatcher";
import { DeathsMatcher } from "../src/matching/DeathsMatcher";
import { LevelMatcher } from "../src/matching/LevelMatcher";
import { LoginMatcher } from "../src/matching/LoginMatcher";
import { PlayedQueryMatcher } from "../src/matching/PlayedQueryMatcher";
import { RemainingMonsterMatcher } from "../src/matching/RemainingMonsterMatcher";
import { SlainMatcher } from "../src/matching/SlainMatcher";
import { TradeActionMatcher } from "../src/matching/TradeActionMatcher";
import { WhisperMatcher } from "../src/matching/whispers/WhisperMatcher";
import { TradeItemWhisperMatcher } from "../src/matching/whispers/TradeItemWhisperMatcher";
import { TradeBulkWhisperMatcher } from "../src/matching/whispers/TradeBulkWhisperMatcher";
import { Matcher } from "../src/matching/Matcher";

const languages = Object.values(Language);

const matchers = [
  new AreaEnteredMatcher(),
  new ConnectedMatcher(),
  new AreaMatcher("areaJoinedBy"),
  new AreaMatcher("areaLeftBy"),
  new AwayMatcher("afk"),
  new AwayMatcher("afkEnd"),
  new AwayMatcher("dnd"),
  new AwayMatcher("dndEnd"),
  new ChatJoinedMatcher(),
  new CreatedQueryMatcher(),
  new DeathsMatcher(),
  new LevelMatcher(),
  new LoginMatcher(),
  new PlayedQueryMatcher(),
  new RemainingMonsterMatcher(),
  new SlainMatcher(),
  new TradeActionMatcher("tradeAccepted"),
  new TradeActionMatcher("tradeCancelled"),
  new WhisperMatcher([], "whisperReceived"),
  new WhisperMatcher([], "whisperSent"),
  new TradeItemWhisperMatcher("buyItemWhisperSent"),
  new TradeBulkWhisperMatcher("buyBulkWhisperSent"),
] as Array<Matcher>;

for (const language of languages) {
  describe(`PoELogEvents - Matching (${language})`, function () {
    testMatcher(new BaseMatcher(), language, ["firedAt", "rawLine"]);

    for (const matcher of matchers) {
      testMatcher(matcher, language);
    }
  });
}

function testMatcher(
  matcher: Readonly<Matcher>,
  language: Language,
  ignoreKeys: Array<keyof LogEvent> = [
    "date",
    "firedAt",
    "logLevel",
    "logMessage",
    "rawLine",
    "source",
  ]
) {
  describe(`${matcher.constructor.name} - ${matcher.eventName}`, () => {
    const data = TestLines[language as keyof typeof TestLines];
    const eventName = matcher.eventName as keyof typeof data;
    const testEvents = data[eventName];

    assert(
      testEvents != undefined && testEvents.length > 0,
      `No test events found for matcher ${matcher.constructor.name} (${language}) - ${eventName}`
    );

    for (const testEvent of testEvents) {
      const logEvent = testEvent as unknown as LogEvent;

      const event = matcher.match(logEvent.logMessage, logEvent, language);

      it(`#match()`, () => {
        expect(event, "Failed to match!").to.be.not.undefined;
      });

      testObject(event as object, testEvent, ignoreKeys);
    }
  });
}

function handleDate(obj: unknown): unknown {
  if (!(typeof obj == "object")) return obj;

  if ("toISOString" in (obj as Date)) {
    return (obj as Date).toISOString();
  } else return obj;
}

function testObject(actual: object, expected: object, ignoreKeys: Array<keyof LogEvent>) {
  for (const [key, actualValue] of Object.entries(actual || [])) {
    if (ignoreKeys.includes(key as keyof LogEvent)) continue;

    const val: unknown = handleDate(actualValue);

    if (typeof val == "object") {
      describe(`${key}`, () => {
        testObject(val as object, expected[key as keyof typeof expected], ignoreKeys);
      });
    } else {
      it(`${key}`, () => {
        expect(val, `Wrong value for key ${key}`).to.be.equal(
          expected[key as keyof typeof expected]
        );
      });
    }
  }
}
