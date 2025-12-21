import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Viewers count toggle.
 */
@action({ UUID: "fr.twitchat.action.viewers-count-toggle" })
export class ViewersCountToggle extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("VIEWERS_COUNT_TOGGLE");
	}
}

/**
 * Settings for {@link ViewersCountToggle}.
 */
type Settings = {};
