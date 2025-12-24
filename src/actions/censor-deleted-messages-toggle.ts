import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Censor deleted messages toggle.
 */
@action({ UUID: "fr.twitchat.action.censor-deleted-messages-toggle" })
export class CensorDeletedMessagesToggle extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("CENSOR_DELETED_MESSAGES_TOGGLE");
	}
}

/**
 * Settings for {@link CensorDeletedMessagesToggle}.
 */
type Settings = {};
