import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Raffle pick winner.
 */
@action({ UUID: "fr.twitchat.action.raffle-pick-winner" })
export class RafflePickWinner extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("RAFFLE_PICK_WINNER");
	}
}

/**
 * Settings for {@link RafflePickWinner}.
 */
type Settings = {};
