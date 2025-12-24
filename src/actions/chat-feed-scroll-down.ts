import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed scroll down.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-scroll-down" })
export class ChatFeedScrollDown extends SingletonAction<Settings> {
	/**
	 * Init action
	 */
	override onWillAppear(ev: WillAppearEvent<Settings>): void {
		if (!ev.action.isKey()) return;
		if(!ev.payload.settings.scrollAmount) {
			ev.action.setSettings({
				scrollAmount: 50
			});
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("CHAT_FEED_SCROLL_DOWN", { scrollBy: ev.payload.settings.scrollAmount || 50, col: ev.payload.settings.colIndex || 0 } );
	}
}

/**
 * Settings for {@link ChatFeedScrollDown}.
 */
type Settings = {
	scrollAmount:number,
	colIndex:number,
};