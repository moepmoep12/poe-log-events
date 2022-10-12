import { AreaEnteredEvent } from "./AreaEnteredEvent";
import { AreaEvent } from "./AreaEvent";
import { AwayEvent } from "./AwayEvent";
import { ChatJoinedEvent } from "./ChatJoinedEvent";
import { ConnectedEvent } from "./ConnectedEvent";
import { CreatedQueryEvent } from "./CreatedQueryEvent";
import { DeathsEvent } from "./DeathsEvents";
import { LevelEvent } from "./LevelEvent";
import { LogEvent } from "./LogEvent";
import { LoginEvent } from "./LoginEvent";
import { PlayedQueryEvent } from "./PlayedQueryEvent";
import { RemainingMonsterEvent } from "./RemainingMonsterEvent";
import { SlainEvent } from "./SlainEvent";
import { TradeEvent } from "./TradeEvent";
import { TradeBulkEvent, TradeItemEvent } from "./whispers";
import { WhisperEvent } from "./whispers/WhisperEvent";

export interface PathOfExileLogEvents {
  // emitted on error
  error: (error: unknown) => void;

  // emitted when a new line was parsed
  line: (event: LogEvent) => void;

  // emitted when a whisper was received
  whisperReceived: (event: WhisperEvent) => void;

  // emitted when a whisper was sent to another player
  whisperSent: (event: WhisperEvent) => void;

  // emitted when another player sends a trade whisper for buying an item
  sellItemWhisperReceived: (event: TradeItemEvent) => void;

  // emitted when the player sends a trade whisper for buying an item from another player
  buyItemWhisperSent: (event: TradeItemEvent) => void;

  // emitted when another player sends a trade whisper for buying items in bulk
  sellBulkWhisperReceived: (event: TradeBulkEvent) => void;

  // emitted when the player sends a trade whisper for buying an item in bulk from another player
  buyBulkWhisperSent: (event: TradeBulkEvent) => void;

  // emitted when the player enters a new area
  areaChanged: (event: AreaEnteredEvent) => void;

  // emitted when the current area was joined by another player
  areaJoinedBy: (event: AreaEvent) => void;

  // emitted when the current area was left by another player
  areaLeftBy: (event: AreaEvent) => void;

  // emitted when a trade was accepted (npc or other player)
  tradeAccepted: (event: TradeEvent) => void;

  // emitted when a trade was cancelled (npc or other player)
  tradeCancelled: (event: TradeEvent) => void;

  // emitted when the client connected to a server
  connected: (event: ConnectedEvent) => void;

  // emitted when the player starts being afk
  afk: (event: AwayEvent) => void;

  // emitted when the player is no longer afk
  afkEnd: (event: AwayEvent) => void;

  // emitted when the player enters dnd mode
  dnd: (event: AwayEvent) => void;

  // emitted when the player left dnd mode
  dndEnd: (event: AwayEvent) => void;

  // emitted when the player logged in
  login: (event: LoginEvent) => void;

  // emitted when the player joined a chat
  chatJoined: (event: ChatJoinedEvent) => void;

  // emitted when the player excuted the query `/deaths`
  deathCount: (event: DeathsEvent) => void;

  // emitted when the player excuted the query `/remaining`
  remainingMonster: (event: RemainingMonsterEvent) => void;

  // emitted when the character was slain
  slain: (event: SlainEvent) => void;

  // emitted when the player level changes
  level: (event: LevelEvent) => void;

  // emitted when the player excuted the query `/played`
  playedQuery: (event: PlayedQueryEvent) => void;

  // emitted when the player excuted the query `/created`
  createdQuery: (event: CreatedQueryEvent) => void;
}
