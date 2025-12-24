import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Hide alert.
 */
@action({ UUID: "fr.twitchat.action.hide-alert" })
export class HideAlert extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("HIDE_ALERT");
	}
}

/**
 * Settings for {@link HideAlert}.
 */
type Settings = {};
