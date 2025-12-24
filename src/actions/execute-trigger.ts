import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Execute trigger.
 */
@action({ UUID: "fr.twitchat.action.execute-trigger" })
export class ExecuteTrigger extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("EXECUTE_TRIGGER");
	}
}

/**
 * Settings for {@link ExecuteTrigger}.
 */
type Settings = {};
