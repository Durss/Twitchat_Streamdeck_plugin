import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Disable stt.
 */
@action({ UUID: "fr.twitchat.action.disable-stt" })
export class DisableStt extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("DISABLE_STT");
	}
}

/**
 * Settings for {@link DisableStt}.
 */
type Settings = {};
