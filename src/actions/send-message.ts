import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Send message.
 */
@action({ UUID: "fr.twitchat.action.send-message" })
export class SendMessage extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("SEND_MESSAGE");
	}
}

/**
 * Settings for {@link SendMessage}.
 */
type Settings = {};
