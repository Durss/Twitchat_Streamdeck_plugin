import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed select.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-select" })
export class ChatFeedSelect extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("CHAT_FEED_SELECT");
	}
}

/**
 * Settings for {@link ChatFeedSelect}.
 */
type Settings = {};
