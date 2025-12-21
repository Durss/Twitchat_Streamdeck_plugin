import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed read all.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-read-all" })
export class ChatFeedReadAll extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("CHAT_FEED_READ_ALL");
	}
}

/**
 * Settings for {@link ChatFeedReadAll}.
 */
type Settings = {};
