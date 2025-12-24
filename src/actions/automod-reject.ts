import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Automod reject.
 */
@action({ UUID: "fr.twitchat.action.automod-reject" })
export class AutomodReject extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("AUTOMOD_REJECT");
	}
}

/**
 * Settings for {@link AutomodReject}.
 */
type Settings = {};
