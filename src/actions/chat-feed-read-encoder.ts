import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed read encoder.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-read-encoder" })
export class ChatFeedReadEncoder extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("CHAT_FEED_READ_ENCODER");
	}
}

/**
 * Settings for {@link ChatFeedReadEncoder}.
 */
type Settings = {};
