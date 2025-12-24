import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Chat feed select.
 */
@action({ UUID: "fr.twitchat.action.chat-feed-select" })
export class ChatFeedSelect extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("CHAT_FEED_SELECT", { col: ev.payload.settings.colIndex || 0 } );
	}
}

/**
 * Settings for {@link ChatFeedSelect}.
 */
type Settings = {
	colIndex: number,
};
