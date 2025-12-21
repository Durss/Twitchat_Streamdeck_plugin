import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Poll toggle.
 */
@action({ UUID: "fr.twitchat.action.poll-toggle" })
export class PollToggle extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("POLL_TOGGLE");
	}
}

/**
 * Settings for {@link PollToggle}.
 */
type Settings = {};
