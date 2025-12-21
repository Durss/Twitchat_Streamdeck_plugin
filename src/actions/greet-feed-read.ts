import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Greet feed read.
 */
@action({ UUID: "fr.twitchat.action.greet-feed-read" })
export class GreetFeedRead extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		// Your code here
		TwitchatSocket.instance.broadcast("GREET_FEED_READ");
	}
}

/**
 * Settings for {@link GreetFeedRead}.
 */
type Settings = {};
