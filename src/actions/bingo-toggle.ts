import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Bingo toggle.
 */
@action({ UUID: "fr.twitchat.action.bingo-toggle" })
export class BingoToggle extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("BINGO_TOGGLE");
	}
}

/**
 * Settings for {@link BingoToggle}.
 */
type Settings = {};
