import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed scroll down.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-scroll-down" })
export class ChatFeedScrollDown extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("CHAT_FEED_SCROLL_DOWN");
	}
}

/**
 * Settings for {@link ChatFeedScrollDown}.
 */
type Settings = {};
