import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed scroll.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-scroll" })
export class ChatFeedScroll extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("CHAT_FEED_SCROLL");
	}
}

/**
 * Settings for {@link ChatFeedScroll}.
 */
type Settings = {};
