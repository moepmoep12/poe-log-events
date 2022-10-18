import { AreaEnteredMatcher } from "./AreaEnteredMatcher";
import { AreaMatcher } from "./AreaMatcher";
import { AwayMatcher } from "./AwayMatcher";
import { BaseMatcher } from "./BaseMatcher";
import { ChatJoinedMatcher } from "./ChatJoinedMatcher";
import { ConnectedMatcher } from "./ConnectedMatcher";
import { CreatedQueryMatcher } from "./CreatedQueryMatcher";
import { DeathsMatcher } from "./DeathsMatcher";
import { LevelMatcher } from "./LevelMatcher";
import { LoginMatcher } from "./LoginMatcher";
import { PlayedQueryMatcher } from "./PlayedQueryMatcher";
import { RemainingMonsterMatcher } from "./RemainingMonsterMatcher";
import { SlainMatcher } from "./SlainMatcher";
import { TradeActionMatcher } from "./TradeActionMatcher";
import { TradeBulkWhisperMatcher } from "./whispers/TradeBulkWhisperMatcher";
import { TradeItemWhisperMatcher } from "./whispers/TradeItemWhisperMatcher";
import { WhisperMatcher } from "./whispers/WhisperMatcher";

export { BaseMatcher } from "./BaseMatcher";

export const rootMatcher = new BaseMatcher([
  new AreaEnteredMatcher(),
  new AreaMatcher(),
  new AwayMatcher(),
  new ChatJoinedMatcher(),
  new ConnectedMatcher(),
  new CreatedQueryMatcher(),
  new DeathsMatcher(),
  new LevelMatcher(),
  new LoginMatcher(),
  new PlayedQueryMatcher(),
  new RemainingMonsterMatcher(),
  new SlainMatcher(),
  new TradeActionMatcher(),
  new WhisperMatcher([new TradeItemWhisperMatcher(), new TradeBulkWhisperMatcher()]),
]);
