import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Clear chat highlight.
 */
@action({ UUID: "fr.twitchat.action.clear-chat-highlight" })
export class ClearChatHighlight extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("CLEAR_CHAT_HIGHLIGHT");
	}
}

/**
 * Settings for {@link ClearChatHighlight}.
 */
type Settings = {};
