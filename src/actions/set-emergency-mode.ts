import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Set emergency mode.
 */
@action({ UUID: "fr.twitchat.action.set-emergency-mode" })
export class SetEmergencyMode extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("SET_EMERGENCY_MODE");
	}
}

/**
 * Settings for {@link SetEmergencyMode}.
 */
type Settings = {};
