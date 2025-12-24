import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import TwitchatSocket from "../TwitchatSocket";

/**
 * Action for Greet feed read all.
 */
@action({ UUID: "fr.twitchat.action.greet-feed-read-all" })
export class GreetFeedReadAll extends SingletonAction<Settings> {
	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		TwitchatSocket.instance.broadcast("GREET_FEED_READ_ALL");
	}
}

/**
 * Settings for {@link GreetFeedReadAll}.
 */
type Settings = {};
