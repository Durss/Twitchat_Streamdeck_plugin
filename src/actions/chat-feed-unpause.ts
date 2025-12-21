import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed unpause.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-unpause" })
export class ChatFeedUnpause extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("CHAT_FEED_UNPAUSE");
	}
}

/**
 * Settings for {@link ChatFeedUnpause}.
 */
type Settings = {};
