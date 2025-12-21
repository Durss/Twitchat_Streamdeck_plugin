import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed read.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-read" })
export class ChatFeedRead extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("CHAT_FEED_READ");
	}
}

/**
 * Settings for {@link ChatFeedRead}.
 */
type Settings = {};
