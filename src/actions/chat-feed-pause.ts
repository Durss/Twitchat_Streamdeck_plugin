import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed pause.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-pause" })
export class ChatFeedPause extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("CHAT_FEED_PAUSE");
	}
}

/**
 * Settings for {@link ChatFeedPause}.
 */
type Settings = {};
