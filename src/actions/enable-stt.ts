import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Enable stt.
 */
@action({ UUID: "fr.twitchat.action.enable-stt" })
export class EnableStt extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("ENABLE_STT");
	}
}

/**
 * Settings for {@link EnableStt}.
 */
type Settings = {};
