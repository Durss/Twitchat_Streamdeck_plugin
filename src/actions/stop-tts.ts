import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Stop tts.
 */
@action({ UUID: "fr.twitchat.action.stop-tts" })
export class StopTts extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("STOP_TTS");
	}
}

/**
 * Settings for {@link StopTts}.
 */
type Settings = {};
