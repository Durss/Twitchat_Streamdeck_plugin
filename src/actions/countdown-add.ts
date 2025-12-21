import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Countdown add.
 */
@action({ UUID: "fr.twitchat.action.countdown-add" })
export class CountdownAdd extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("COUNTDOWN_ADD");
	}
}

/**
 * Settings for {@link CountdownAdd}.
 */
type Settings = {};
