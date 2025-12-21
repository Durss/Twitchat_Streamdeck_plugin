import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Mod tools toggle.
 */
@action({ UUID: "fr.twitchat.action.mod-tools-toggle" })
export class ModToolsToggle extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("MOD_TOOLS_TOGGLE");
	}
}

/**
 * Settings for {@link ModToolsToggle}.
 */
type Settings = {};
