import { AreaEnteredEvent } from "./AreaEnteredEvent";
import { AreaEvent } from "./AreaEvent";
import { AreaGeneratedEvent } from "./AreaGeneratedEvent";
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
  /**
   * Emitted on error
   */
  error: (error: unknown) => void;

  /**
   * Emitted when a new line was parsed
   */
  line: (event: LogEvent) => void;

  /**
   * Emitted when a whisper was received
   *
   * @remarks `INFO` event
   */
  whisperReceived: (event: WhisperEvent) => void;

  /**
   * Emitted when a whisper was sent to another player
   *
   * @remarks `INFO` event
   */
  whisperSent: (event: WhisperEvent) => void;

  /**
   * Emitted when another player sends a trade whisper for buying an item
   *
   * @remarks `INFO` event
   */
  sellItemWhisperReceived: (event: TradeItemEvent) => void;

  /**
   * Emitted when the player sends a trade whisper for buying an item from another player
   *
   * @remarks `INFO` event
   */
  buyItemWhisperSent: (event: TradeItemEvent) => void;

  /**
   * Emitted when another player sends a trade whisper for buying items in bulk
   *
   * @remarks `INFO` event
   */
  sellBulkWhisperReceived: (event: TradeBulkEvent) => void;

  /**
   * Emitted when the player sends a trade whisper for buying an item in bulk from another player
   *
   * @remarks `INFO` event
   */
  buyBulkWhisperSent: (event: TradeBulkEvent) => void;

  /**
   * Emitted when the player enters a new area
   *
   * @remarks `INFO` event
   *
   * @remarks Only contains the area name. For detailed
   * area information see {@link AreaGeneratedEvent} which is
   * fired right before entering an area for the first time
   * or use `getWorldAreaByName()` to search for the world area
   */
  areaEntered: (event: AreaEnteredEvent) => void;

  /**
   * Emitted when the current area was joined by another player
   *
   * @remarks `INFO` event
   */
  areaJoinedBy: (event: AreaEvent) => void;

  /**
   * Emitted when the current area was left by another player
   *
   * @remarks `INFO` event
   */
  areaLeftBy: (event: AreaEvent) => void;

  /**
   * Emitted when a trade was accepted (npc or other player)
   *
   * @remarks `INFO` event
   */
  tradeAccepted: (event: TradeEvent) => void;

  /**
   * Emitted when a trade was cancelled (npc or other player)
   *
   * @remarks `INFO` event
   */
  tradeCancelled: (event: TradeEvent) => void;

  /**
   * Emitted when the client connected to a server
   *
   * @remarks `INFO` event
   */
  connected: (event: ConnectedEvent) => void;

  /**
   * Emitted when the player starts being afk
   *
   * @remarks `INFO` event
   */
  afk: (event: AwayEvent) => void;

  /**
   * Emitted when the player is no longer afk
   *
   * @remarks `INFO` event
   */
  afkEnd: (event: AwayEvent) => void;

  /**
   * Emitted when the player enters dnd mode
   *
   * @remarks `INFO` event
   */
  dnd: (event: AwayEvent) => void;

  /**
   * Emitted when the player left dnd mode
   *
   * @remarks `INFO` event
   */
  dndEnd: (event: AwayEvent) => void;

  /**
   * Emitted when the player logged in
   *
   * @remarks `INFO` event
   */
  login: (event: LoginEvent) => void;

  /**
   * Emitted when the player joined a chat
   *
   * @remarks `INFO` event
   */
  chatJoined: (event: ChatJoinedEvent) => void;

  /**
   * Emitted when the player excuted the query `/deaths`
   *
   * @remarks `INFO` event
   */
  deathCount: (event: DeathsEvent) => void;

  /**
   * Emitted when the player excuted the query `/remaining`
   *
   * @remarks `INFO` event
   */
  remainingMonster: (event: RemainingMonsterEvent) => void;

  /**
   * Emitted when the character was slain
   *
   * @remarks `INFO` event
   */
  slain: (event: SlainEvent) => void;

  /**
   * Emitted when the player level changes
   *
   * @remarks `INFO` event
   */
  level: (event: LevelEvent) => void;

  /**
   * Emitted when the player excuted the query `/played`
   *
   * @remarks `INFO` event
   */
  playedQuery: (event: PlayedQueryEvent) => void;

  /**
   * Emitted when the player excuted the query `/created`
   *
   * @remarks `INFO` event
   */
  createdQuery: (event: CreatedQueryEvent) => void;

  /**
   * Emitted when a new area was generated which was entered
   * for the first time
   *
   * @remarks `DEBUG` event.
   *
   * @remarks Does only trigger once for the same area
   */
  areaGenerated: (event: AreaGeneratedEvent) => void;
}
