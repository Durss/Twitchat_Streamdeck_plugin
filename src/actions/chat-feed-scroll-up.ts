import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed scroll up.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-scroll-up" })
export class ChatFeedScrollUp extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("CHAT_FEED_SCROLL_UP");
	}
}

/**
 * Settings for {@link ChatFeedScrollUp}.
 */
type Settings = {};
