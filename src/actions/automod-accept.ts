import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Automod accept.
 */
@action({ UUID: "fr.twitchat.action.automod-accept" })
export class AutomodAccept extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("AUTOMOD_ACCEPT");
	}
}

/**
 * Settings for {@link AutomodAccept}.
 */
type Settings = {};
