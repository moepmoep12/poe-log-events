import { WhisperDirection } from "../../models";
import { LogEvent } from "../LogEvent";

export interface WhisperEvent extends LogEvent {
  player: string;
  whisper: string;
  direction: WhisperDirection;
}
