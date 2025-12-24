import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Shoutout.
 */
@action({ UUID: "fr.twitchat.action.shoutout" })
export class Shoutout extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("SHOUTOUT");
	}
}

/**
 * Settings for {@link Shoutout}.
 */
type Settings = {};
