import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Merge toggle.
 */
@action({ UUID: "fr.twitchat.action.merge-toggle" })
export class MergeToggle extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("MERGE_TOGGLE");
	}
}

/**
 * Settings for {@link MergeToggle}.
 */
type Settings = {};
