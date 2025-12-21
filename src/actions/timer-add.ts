import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Timer add.
 */
@action({ UUID: "fr.twitchat.action.timer-add" })
export class TimerAdd extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("TIMER_ADD");
	}
}

/**
 * Settings for {@link TimerAdd}.
 */
type Settings = {};
