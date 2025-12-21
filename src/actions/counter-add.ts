import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Counter add.
 */
@action({ UUID: "fr.twitchat.action.counter-add" })
export class CounterAdd extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("COUNTER_ADD");
	}
}

/**
 * Settings for {@link CounterAdd}.
 */
type Settings = {};
