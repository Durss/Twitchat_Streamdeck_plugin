import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Toggle trigger.
 */
@action({ UUID: "fr.twitchat.action.toggle-trigger" })
export class ToggleTrigger extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("TOGGLE_TRIGGER");
	}
}

/**
 * Settings for {@link ToggleTrigger}.
 */
type Settings = {};
